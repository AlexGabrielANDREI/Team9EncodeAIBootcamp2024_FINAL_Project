import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`progress-bar ${className || ""}`}>
      <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
    </div>
  );
};
