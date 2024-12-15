import {
  IndexDict,
  OpenAI,
  RetrieverQueryEngine,
  TextNode,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
import type { NextApiRequest, NextApiResponse } from "next";

type Input = {
  issue: string;
  nodesWithEmbedding: {
    text: string;
    embedding: number[];
  }[];
};

type Output = {
  error?: string;
  payload?: {
    step: {
      instruction: string;
      manualReference: string;
      humanResources: string;
      materials: string;
      tools: string;
      followUpQuestion: string;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { issue, nodesWithEmbedding }: Input = req.body;

  try {
    // Reconstruct the index from nodes with embeddings
    const embeddingResults = nodesWithEmbedding.map((config) => {
      return new TextNode({ text: config.text, embedding: config.embedding });
    });

    const indexDict = new IndexDict();
    for (const node of embeddingResults) {
      indexDict.addNode(node);
    }

    const index = await VectorStoreIndex.init({
      indexStruct: indexDict,
      serviceContext: serviceContextFromDefaults({
        llm: new OpenAI({
          model: "gpt-4",
          temperature: 0.1,
          topP: 1,
        }),
      }),
    });

    index.vectorStore.add(embeddingResults);
    if (!index.vectorStore.storesText) {
      await index.docStore.addDocuments(embeddingResults, true);
    }
    await index.indexStore?.addIndexStruct(indexDict);
    index.indexStruct = indexDict;

    const retriever = index.asRetriever();
    retriever.similarityTopK = 2; // Adjust as needed

    const queryEngine = new RetrieverQueryEngine(retriever);

    // Define the prompt to generate the initial troubleshooting step
    const prompt = `
  You are an expert technician assistant. Based on the following issue described by the user:
  "${issue}"
  And using the maintenance manual provided, generate the first troubleshooting step.

  You must respond with ONLY a JSON object, with no additional text or explanation, using the following format:
  {
    "instruction": "Detailed step instruction",
    "manualReference": "Section and page number in the manual",
    "humanResources": "Required technician level",
    "materials": "Any materials needed",
    "tools": "Tools required",
    "followUpQuestion": "A question to ask the user after performing the step"
  }

  Your response must be a valid JSON object that can be parsed with JSON.parse().
`;

    const result = await queryEngine.query(prompt);

    // Parse the result.response into JSON
    let step;
    try {
      step = JSON.parse(result.response);
    } catch (e) {
      res.status(200).json({
        error:
          "Failed to parse AI response into JSON. Please ensure the AI response is in correct JSON format.",
      });
      return;
    }

    res.status(200).json({ payload: { step } });
  } catch (error) {
    console.error("Error in /api/gettroubleshootingsteps:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
