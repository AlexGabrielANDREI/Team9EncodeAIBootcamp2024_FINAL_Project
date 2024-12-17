import { OpenAI } from 'openai'; // Import the OpenAI package

// Initialize the OpenAI client with the API key from the environment variable
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Fetch the API key from the environment variables
});

// Function to call OpenAI's image generation API
async function callOpenAIImageAPI(instruction: string): Promise<string> {
  try {
    // Call the OpenAI image generation API (DALL-E)
    const response = await openai.images.generate({
      model: 'dall-e-3', // Specify the model to use
      prompt: instruction, // Use the instruction as the prompt
      n: 1, // Number of images to generate
      size: '1024x1024', // Size of the generated image
    }) as { data: { url: string }[] }; // Type assertion for response

    // Validate response structure
    if (response.data && response.data.length > 0) {
      return response.data[0].url; // Return the URL of the generated image
    } else {
      throw new Error('No image generated or unexpected response structure');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image with OpenAI API');
  }
}

// Function to generate an image based on the step instruction
export async function generateImageBasedOnStep(instruction: string): Promise<string> {
  if (!instruction || typeof instruction !== 'string') {
    throw new Error('Invalid instruction provided for image generation');
  }
  return await callOpenAIImageAPI(instruction); // Call the API with the instruction
}