# AI-Powered Troubleshooting Assistant

Welcome to the **AI-Powered Troubleshooting Assistant**! This application helps technicians troubleshoot issues efficiently based on a synthetic maintenance manual. It leverages the power of AI, allowing users to provide issues either through **text** or **image uploads**, and guides users step-by-step with interactive troubleshooting instructions.

---

## 🛠 **Key Features**

### 🔹 **Issue Input Options**

- **Text-Based Input**: Describe the issue using plain text.
- **Image-Based Input**: Upload an image, and the AI analyzes the visual content to identify and describe the issue.

### 🔹 **AI-Powered Troubleshooting**

- The application utilizes **Retrieval-Augmented Generation (RAG)** to generate troubleshooting steps based on a maintenance manual.
- Dynamic steps are generated based on user feedback, creating a **decision tree** that adapts to the user's responses.

### 🔹 **Step-Specific Images**

- For each troubleshooting step, the AI generates **customized images** to visually assist the user with the repair process.
- Images are generated using **OpenAI's DALL·E** model.

### 🔹 **Interactive and User-Friendly**

- A clean UI to upload files, describe issues, and interact with the AI assistant.
- Progress is tracked through a **multi-step process**:
  1. **Upload Maintenance Manual**
  2. **Describe the Issue**
  3. **Troubleshoot with AI Guidance**

---

## 🚀 **Getting Started**

### 1. **Clone the Repository**

```bash
https://github.com/AlexGabrielANDREI/Team9EncodeAIBootcamp2024_FINAL_Project.git
```

### 2. **Install Dependencies**

Navigate to the project folder and install the required dependencies:

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory and add the following:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Ensure you replace `your_openai_api_key` with your OpenAI API key.

### 4. **Run the Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## 📂 **Project Structure**

```plaintext
├── assets/                  # Contains demo images and synthetic maintenance manual
├── pages/
│   ├── api/
│   │   ├── analyzeimage.ts           # Handles image analysis to detect issues
│   │   ├── gettroubleshootingsteps.ts # Generates first troubleshooting step
│   │   ├── getnextstep.ts            # Generates subsequent steps based on feedback
│   │   ├── imageGenerator.ts         # Generates step-specific images
│   └── index.tsx                     # Main UI for the application
├── components/ui/          # Reusable UI components (Button, Input, etc.)
├── public/                 # Static files
└── README.md               # Project documentation
```

---

## 🧩 **How It Works**

1. **Upload Maintenance Manual**

   - The user uploads a `.txt` manual. The AI processes and indexes the content for troubleshooting.

2. **Describe the Issue**

   - **Option 1**: Provide a text description of the issue.
   - **Option 2**: Upload an image of the issue. The AI analyzes the image and converts it into a text description.

3. **Troubleshooting Steps**

   - The AI uses the indexed manual to generate troubleshooting steps tailored to the issue.
   - After each step, the user can provide **feedback**, which the AI uses to decide the next appropriate step.
   - The application dynamically creates a **decision tree** to guide the user toward solving the issue.

4. **Step-Specific Image Generation**
   - For every troubleshooting step, the AI generates a unique image to assist with repairs visually.

---

## 📜 **Technologies Used**

- **Next.js** - Framework for React.
- **OpenAI GPT-4o** - AI model for generating troubleshooting steps and analyzing issues.
- **OpenAI DALL·E** - AI model for generating step-specific images.
- **LlamaIndex** - For RAG-based querying of the manual.
- **TypeScript** - Static typing for better developer experience.

---

## ⚠️ **Limitations**

- The AI performance relies heavily on the quality of the uploaded manual and the clarity of user input.
- Ensure images uploaded are clear and relevant for better analysis.

---
