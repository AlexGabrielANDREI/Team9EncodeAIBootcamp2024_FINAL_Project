import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type Input = {
  image: string; // base64 encoded image
};

type Output = {
  error?: string;
  description?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { image } = req.body as Input;

    if (!image) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      res.status(400).json({ error: "Invalid image format" });
      return;
    }

    // Extract base64 data
    const base64Data = image.split(',')[1];

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are an aeroplanes technical maintenance expert. Analyze this image and describe the technical issue or maintenance problem shown. Focus on specific technical details and potential problems visible in the image. Provide a concise, clear description that could be used for troubleshooting, Only provide a description, and refraing from suggesting troubleshooting steps."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const description = response.choices[0]?.message?.content;

    if (!description) {
      res.status(500).json({ error: "Failed to analyze image" });
      return;
    }

    res.status(200).json({ description });
  } catch (error) {
    console.error("Error in /api/analyzeimage:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
}