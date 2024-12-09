Character Extraction with LlamaIndex
Overview
This project is a web application that allows users to upload a .txt file (such as a book or any text with characters and settings) and extract character information using a Retrieval-Augmented Generation (RAG) pipeline with LlamaIndex.

The application:

Splits the uploaded text into chunks and builds a vector index.
Extracts characters from the text using a predefined prompt.
Displays the extracted characters with their names, descriptions, and personalities in JSON format and in a table.
Features
File Upload: Upload a .txt file containing the text from which you want to extract characters.
Customizable Settings: Adjust parameters such as chunk size, chunk overlap, top K results, temperature, and top P for the model.
Index Building: Build an index of the text chunks with embeddings for efficient retrieval.
Character Extraction: Extract character information using a RAG pipeline and display results.
Results Display: View the extracted character data in both JSON format and a formatted table.
Technologies Used
Next.js: A React framework for server-side rendering and building web applications.
TypeScript: Provides type safety for JavaScript code.
LlamaIndex: An interface between your data and large language models (LLMs), enabling efficient retrieval and interaction.
OpenAI API: Utilizes GPT-4 for processing and generating responses.
Prerequisites
Node.js: Ensure you have Node.js installed (version 14 or higher recommended).
OpenAI API Key: You'll need an OpenAI API key to use GPT-4.
Getting Started
Installation
Clone the Repository

bash
Copy code
git clone https://github.com/yourusername/character-extraction-llamaindex.git
Navigate to the Project Directory

bash
Copy code
cd character-extraction-llamaindex
Install Dependencies

bash
Copy code
npm install
Configuration
Set Up Environment Variables

Create a .env.local file in the root of your project and add your OpenAI API key:

env
Copy code
OPENAI_API_KEY=your-openai-api-key
Running the Application
Start the development server:

bash
Copy code
npm run dev
Open your browser and navigate to http://localhost:3000 to view the application.

Usage
Upload a .txt File

Click on the file input field to upload a .txt file containing the text from which you want to extract characters.
The contents of the file will be displayed in a read-only text area.
Adjust Settings (Optional)

Chunk Size: Adjust the maximum size of the text chunks (in tokens).
Chunk Overlap: Adjust the overlap between chunks (in tokens).
Top K: Set the number of top chunks to retrieve.
Temperature: Control the creativity of the model's responses.
Top P: Control the probability mass of tokens to consider.
Build Index

Click the "Build Index" button to process the text and build a vector index.
A message will indicate when the index is built.
Extract Characters

After the index is built, click the "Extract Characters" button.
The application will extract character information from the text.
Messages will inform you of the progress.
View Results

The extracted character data will be displayed in JSON format.
Below the JSON output, a table presents the characters with their names, descriptions, and personalities.
Project Structure
pages/

index.tsx: The main page component containing the UI and logic for the application.
api/
splitandembed.ts: API endpoint for splitting the uploaded text and generating embeddings.
extractcharacters.ts: API endpoint for extracting characters from the text using the built index.
components/ui/: Custom UI components such as Button, Input, Label, LinkedSlider, and Textarea.

lib/: Contains any utility functions or sample data.

API Endpoints
POST /api/splitandembed
Description: Processes the uploaded text by splitting it into chunks and generating embeddings.

Request Body:

json
Copy code
{
"document": "The text content...",
"chunkSize": 1024,
"chunkOverlap": 20
}
Response:

json
Copy code
{
"payload": {
"nodesWithEmbedding": [
{
"text": "Chunk of text...",
"embedding": [0.123, 0.456, ...]
},
...
]
}
}
POST /api/extractcharacters
Description: Extracts character information from the text using the built index.

Request Body:

json
Copy code
{
"nodesWithEmbedding": [...],
"topK": 2,
"temperature": 0.1,
"topP": 1
}
Response:

json
Copy code
{
"payload": {
"characters": [
{
"name": "Character Name",
"description": "Brief description.",
"personality": "Personality traits."
},
...
]
}
}
Customization
Model Settings: Adjust the temperature and topP parameters to control the model's response behavior.

Chunking Parameters: Modify chunkSize and chunkOverlap to change how the text is divided, which can impact the quality of the extraction.

Prompt Modification: The prompt used for character extraction is defined in extractcharacters.ts. You can modify it to suit your needs.

Troubleshooting
Invalid API Key: Ensure your OpenAI API key is correctly set in the .env.local file.

Model Access: Verify that your API key has access to GPT-4.

CORS Issues: If you encounter CORS errors, ensure your API routes are correctly configured and you're not making cross-origin requests unnecessarily.

JSON Parsing Errors: If the AI response cannot be parsed into JSON, consider adjusting the prompt or the model parameters to encourage the model to output valid JSON.

Dependencies
llamaindex
next
react
openai
Ensure all dependencies are installed by running npm install.

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests for improvements or bug fixes.
