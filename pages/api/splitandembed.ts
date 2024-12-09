import {
  Document,
  MetadataMode,
  SentenceSplitter,
  VectorStoreIndex,
  getNodesFromDocument,
  serviceContextFromDefaults,
} from "llamaindex";
import type { NextApiRequest, NextApiResponse } from "next";

type Input = {
  document: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

type Output = {
  error?: string;
  payload?: {
    nodesWithEmbedding: {
      text: string;
      embedding: number[];
    }[];
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

  const { document, chunkSize = 1024, chunkOverlap = 20 }: Input = req.body;

  try {
    // Create a Document object from the manual text
    const doc = new Document({ text: document });

    // Split the document into nodes using SentenceSplitter
    const splitter = new SentenceSplitter({ chunkSize, chunkOverlap });
    const nodes = getNodesFromDocument(doc, splitter);

    // Initialize the service context with default settings
    const serviceContext = serviceContextFromDefaults();

    // Generate embeddings for each node
    const nodesWithEmbeddings = await VectorStoreIndex.getNodeEmbeddingResults(
      nodes,
      serviceContext,
      true,
    );

    // Prepare the response payload
    const responsePayload = {
      nodesWithEmbedding: nodesWithEmbeddings.map((nodeWithEmbedding) => ({
        text: nodeWithEmbedding.getContent(MetadataMode.NONE),
        embedding: nodeWithEmbedding.getEmbedding(),
      })),
    };

    res.status(200).json({ payload: responsePayload });
  } catch (error) {
    console.error("Error in /api/splitandembed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
