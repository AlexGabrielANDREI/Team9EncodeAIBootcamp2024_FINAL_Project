import {
  IndexDict,
  OpenAI,
  RetrieverQueryEngine,
  TextNode,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateImageBasedOnStep } from "./imageGenerator"; // Import the image generation function

type Step = {
  instruction: string;
  manualReference: string;
  humanResources: string;
  materials: string;
  tools: string;
  followUpQuestion: string;
  feedback?: string; 
  imageUrl?: string;// Added feedback property
};

type Input = {
  feedback: string;
  conversation: Step[];
  nodesWithEmbedding: {
    text: string;
    embedding: number[];
  }[];
};

type Output = {
  error?: string;
  payload?: {
    step: Step;
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

  const { feedback, conversation, nodesWithEmbedding }: Input = req.body;

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

    // Build the conversation history for context
    let conversationHistory = "";
    conversation.forEach((step, index) => {
      conversationHistory += `
Step ${index + 1}:
Instruction: ${step.instruction}
Manual Reference: ${step.manualReference}
Human Resources: ${step.humanResources}
Materials: ${step.materials}
Tools: ${step.tools}
Follow-up Question: ${step.followUpQuestion}
User Response: ${step.feedback || (index === conversation.length - 1 ? feedback : "")}
`;
    });

    // Define the prompt to generate the next troubleshooting step
    const prompt = `
You are an expert technician assistant helping a user troubleshoot an issue.
Based on the previous conversation:

${conversationHistory}

Using the maintenance manual provided, generate the next troubleshooting step.
The response should be a JSON object with the following keys:
- "instruction": Detailed step instruction.
- "manualReference": Section and page number in the manual.
- "humanResources": Required technician level.
- "materials": Any materials needed.
- "tools": Tools required.
- "followUpQuestion": A question to ask the user after performing the step.
Ensure the JSON is properly formatted.
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

     // Generate image based on 'step' object (your custom logic for image generation)
     if (step && typeof step.instruction === 'string') {
      const image = await generateImageBasedOnStep(step.instruction);
      console.log("Image to be generated:", image);
      step.imageUrl = image; // Add the generated image URL to the step object
    } else {
      console.error('Invalid step object or instruction is not a string');
    }

    res.status(200).json({ payload: { step } });
  } catch (error) {
    console.error("Error in /api/getnextstep:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
