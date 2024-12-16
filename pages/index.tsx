import { ChangeEvent, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProgress } from "@/components/ui/stepProgress";
import { Textarea } from "@/components/ui/textarea";

interface Step {
  instruction: string;
  manualReference: string;
  humanResources: string;
  materials: string;
  tools: string;
  followUpQuestion: string;
  feedback?: string;
  imageUrl?: string;
}

export default function Home() {
  const sourceId = useId();
  const [manualText, setManualText] = useState("");
  const [needsNewIndex, setNeedsNewIndex] = useState(true);
  const [buildingIndex, setBuildingIndex] = useState(false);
  const [nodesWithEmbedding, setNodesWithEmbedding] = useState([]);
  const [message, setMessage] = useState("");

  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  // State for tracking current stage
  const [currentStage, setCurrentStage] = useState(1);

  // Define steps for the StepProgress component
  const steps = [
    {
      number: 1,
      name: "Upload Maintenance Manual",
      description: "Upload the maintenance manual.",
    },
    {
      number: 2,
      name: "Describe Issue",
      description: "Provide details about the issue.",
    },
    {
      number: 3,
      name: "Troubleshoot",
      description: "Interact with the AI assistant.",
    },
  ];

  return (
    <>
      <main className="mx-2 flex h-full flex-col lg:mx-56">
        {/* Header with StepProgress component */}
        <header className="my-4 text-center">
          <h1>AI-Powered Troubleshooting Assistant</h1>
          <StepProgress steps={steps} currentStep={currentStage} />
        </header>

        {/* Stage 1: Upload Maintenance Document */}
        {currentStage === 1 && (
          <div className="my-2 flex flex-col space-y-2">
            <Label htmlFor={sourceId}>Upload Reference Manual (.txt):</Label>
            <Input
              id={sourceId}
              type="file"
              accept=".txt"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const fileContent = event.target?.result as string;
                    setManualText(fileContent);
                    setNeedsNewIndex(true);
                    setConversation([]);
                  };
                  if (file.type !== "text/plain") {
                    console.error(`${file.type} parsing not implemented`);
                    setManualText("Error");
                  } else {
                    reader.readAsText(file);
                  }
                }
              }}
            />
            {/* Display uploaded text */}
            {manualText && (
              <Textarea
                value={manualText}
                readOnly
                placeholder="Manual contents will appear here"
                className="mt-2 flex-1"
              />
            )}
            {/* Build Index Button */}
            <Button
              disabled={!needsNewIndex || buildingIndex || !manualText}
              onClick={async () => {
                setMessage("Building index...");
                setBuildingIndex(true);
                setNeedsNewIndex(false);
                const result = await fetch("/api/splitandembed", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    document: manualText,
                    chunkSize: 1024,
                    chunkOverlap: 20,
                  }),
                });
                const { error, payload } = await result.json();

                if (error) {
                  console.error(error);
                  setMessage(error);
                }

                if (payload) {
                  setNodesWithEmbedding(payload.nodesWithEmbedding);
                  setMessage("Index built!");
                  setCurrentStage(2); // Move to next stage
                }

                setBuildingIndex(false);
              }}
            >
              {buildingIndex ? "Building Index..." : "Build Index"}
            </Button>
            {message && <p className="text-green-500">{message}</p>}
          </div>
        )}

        {/* Stage 2: Describe the Issue Input */}
        {currentStage === 2 && (
          <div className="my-4">
            <Label htmlFor="userInput">Describe the issue:</Label>
            <Input
              id="userInput"
              type="text"
              value={userInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserInput(e.target.value)
              }
              placeholder="e.g., Engine overheating"
              className="mt-2"
            />
            <Button
              className="mt-2"
              onClick={async () => {
                setLoading(true);

                // Send the user input and nodesWithEmbedding to the API for processing
                const response = await fetch("/api/gettroubleshootingsteps", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    issue: userInput,
                    nodesWithEmbedding,
                  }),
                });

                const data = await response.json();

                if (data.error) {
                  console.error(data.error);
                  setMessage(data.error);
                } else {
                  setConversation([data.payload.step]);
                  setUserInput("");
                  setMessage("");
                  setCurrentStage(3); // Move to next stage
                }

                setLoading(false);
              }}
              disabled={loading || !userInput}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
            {message && <p className="text-red-500">{message}</p>}
          </div>
        )}

        {/* Stage 3: AI Maintenance Chat Assistant */}
        {currentStage === 3 && (
          <div className="my-4">
            {conversation.map((step, index) => (
              <div key={index} className="my-4 border-b pb-4">
                <p className="my-4">
                  <strong style={{ color: "#FF00FF" }}>
                    Step {index + 1}:
                  </strong>{" "}
                  <span className="text-white-800">{step.instruction}</span>
                </p>
                {step.imageUrl && ( // Render the image if it exists
                  <img src={step.imageUrl} alt={`Step ${index + 1} Image`} className="my-4" />
                )}
                <p>
                  <strong className="text-blue-600">Manual Reference:</strong>{" "}
                  {step.manualReference}
                </p>
                <p>
                  <strong className="text-blue-600">Human Resources:</strong>{" "}
                  {step.humanResources}
                </p>
                <p>
                  <strong className="text-blue-600">Materials:</strong>{" "}
                  {step.materials}
                </p>
                <p>
                  <strong className="text-blue-600">Tools:</strong> {step.tools}
                </p>
                <p className="my-4">
                  <strong className="text-blue-600">Follow-up Question:</strong>{" "}
                  <span className="text-green-600">
                    {step.followUpQuestion}
                  </span>
                </p>
                {/* Display User Feedback if available */}
                {step.feedback && (
                  <p>
                    <strong>Your Response:</strong> {step.feedback}
                  </p>
                )}

                {/* Feedback Input */}
                {index === conversation.length - 1 && !step.feedback && (
                  <div className="mt-2">
                    <Label htmlFor={`feedback-${index}`}>Your Response:</Label>
                    <Input
                      id={`feedback-${index}`}
                      type="text"
                      value={userInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUserInput(e.target.value)
                      }
                      placeholder="Enter your feedback here"
                      className="mt-2"
                    />
                    <Button
                      className="mt-2"
                      onClick={async () => {
                        setLoading(true);

                        // Send the feedback, nodesWithEmbedding, and conversation to the API to get the next step
                        const response = await fetch("/api/getnextstep", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            feedback: userInput,
                            nodesWithEmbedding,
                            conversation,
                          }),
                        });

                        const data = await response.json();

                        if (data.error) {
                          console.error(data.error);
                          setMessage(data.error);
                        } else {
                          // Include the feedback in the previous step
                          const updatedConversation = [...conversation];
                          updatedConversation[updatedConversation.length - 1] =
                            {
                              ...updatedConversation[
                                updatedConversation.length - 1
                              ],
                              feedback: userInput,
                            };

                          // Add the new step
                          updatedConversation.push(data.payload.step);

                          setConversation(updatedConversation);
                          setUserInput("");
                          setMessage("");
                        }

                        setLoading(false);
                      }}
                      disabled={loading || !userInput}
                    >
                      {loading ? "Processing..." : "Submit Feedback"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {message && <p className="text-red-500">{message}</p>}
          </div>
        )}
      </main>
    </>
  );
}
