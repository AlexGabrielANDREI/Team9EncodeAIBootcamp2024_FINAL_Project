import React from "react";

interface Step {
  number: number;
  name: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="my-4 flex items-center justify-between">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex flex-col items-center rounded border p-2 ${
            step.number === currentStep
              ? "bg-white text-black"
              : "bg-transparent"
          }`}
          style={{
            borderColor: "#FFFFFF",
            borderWidth: 1,
            minWidth: "200px",
          }}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step.number === currentStep
                ? "bg-blue-600 text-white"
                : "bg-blue-200 text-gray-600"
            }`}
          >
            {step.number}
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium">{step.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
