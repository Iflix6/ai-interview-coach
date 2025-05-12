// components/QuestionList.tsx
"use client";

import { HelpCircle } from "lucide-react";

interface QuestionListProps {
  questions: string[];
  currentIndex: number;
  onNext: () => void;
  showResults: boolean;
  answeredQuestions: boolean[];
}

export default function QuestionList({ questions, currentIndex, onNext, showResults, answeredQuestions }: QuestionListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Question List</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-3">
          {questions.map((question, index) => (
            <li
              key={index}
              className={`flex items-start gap-2 p-2 rounded-md ${
                index === currentIndex && !showResults ? "bg-blue-50" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  answeredQuestions[index]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm ${
                  index === currentIndex && !showResults ? "font-medium" : "text-gray-700"
                }`}
              >
                {question}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <HelpCircle className="h-6 w-6 text-green-500" />
        <HelpCircle className="h-6 w-6 text-green-500" />
      </div>
    </div>
  );
}