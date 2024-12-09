import { ReactNode } from "react";

export const Table = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <table
      className={`w-full table-auto border-collapse border border-gray-300 ${className}`}
    >
      {children}
    </table>
  );
};
