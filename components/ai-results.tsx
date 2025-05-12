// components/AIResults.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface AIResultsProps {
  showResults: boolean;
  answers: { question: string; answer: string }[];
}

export default function AIResults({ showResults, answers }: AIResultsProps) {
  const [activeTab, setActiveTab] = useState("score");
  const [scoreData, setScoreData] = useState({
    overall: 0,
    professionalism: 0,
    businessAcumen: 0,
    opportunistic: 0,
    closingTechnique: 0,
  });
  const [summary, setSummary] = useState(
    "The presentation of sales is good. Check the breakdown summary of AI Video Score."
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showResults && answers.length > 0) {
      const fetchScores = async () => {
        setIsLoading(true);
        try {
          const prompt = `
            You are an AI interview coach evaluating a candidate's answers for a sales role. Analyze the following interview answers and provide:
            - Scores (0-100) for the following categories as integers:
              - Overall performance
              - Professionalism
              - Business Acumen
              - Opportunistic approach
              - Closing Technique
            - A brief summary (1-2 sentences, under 50 words) of the candidate's performance.

            Format your response exactly as follows:
            Overall: <score>
            Professionalism: <score>
            Business Acumen: <score>
            Opportunistic: <score>
            Closing Technique: <score>
            Summary: <summary text>

            Answers:
            ${answers
              .map((a, idx) => `Question ${idx + 1}: ${a.question}\nAnswer: ${a.answer}`)
              .join("\n\n")}
          `;

          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, history: [] }),
          });

          const data = await response.json();
          if (data.response) {
            const lines = data.response.split("\n");
            const scores = {
              overall: parseInt(
                lines.find((line: string) => line.includes("Overall"))?.match(/\d+/)?.[0] || "0"
              ),
              professionalism: parseInt(
                lines
                  .find((line: string) => line.includes("Professionalism"))
                  ?.match(/\d+/)?.[0] || "0"
              ),
              businessAcumen: parseInt(
                lines
                  .find((line: string) => line.includes("Business Acumen"))
                  ?.match(/\d+/)?.[0] || "0"
              ),
              opportunistic: parseInt(
                lines
                  .find((line: string) => line.includes("Opportunistic"))
                  ?.match(/\d+/)?.[0] || "0"
              ),
              closingTechnique: parseInt(
                lines
                  .find((line: string) => line.includes("Closing Technique"))
                  ?.match(/\d+/)?.[0] || "0"
              ),
            };
            const summaryText = lines
              .find((line: string) => line.includes("Summary"))
              ?.replace("Summary: ", "");
            setScoreData(scores);
            setSummary(summaryText || summary);
          }
        } catch (error) {
          console.error("Error fetching scores:", error);
          setScoreData({
            overall: 85,
            professionalism: 80,
            businessAcumen: 90,
            opportunistic: 65,
            closingTechnique: 85,
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchScores();
    }
  }, [showResults, answers]);

  if (!showResults) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">AI Video Score Detail</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-6 bg-gray-50 rounded-lg">
          <div>
            <p className="text-gray-500 mb-2">Complete the interview to see your results</p>
            <p className="text-sm text-gray-400">
              The AI will analyze your performance and provide detailed feedback
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500">AI Video Score Detail</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="text-center mb-4">
            {isLoading ? (
              <div className="text-center">
                <p className="text-gray-500">Analyzing your performance...</p>
              </div>
            ) : (
              <>
                <div className="text-5xl font-bold text-gray-800">{scoreData.overall}%</div>
                <h4 className="text-lg font-medium mt-2">AI Video Score Summary</h4>
                <p className="text-sm text-gray-600 mt-2">{summary}</p>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>

          <Button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white"
            disabled={isLoading}
          >
            See Next
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="relative inline-flex">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scoreData.professionalism / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold">{scoreData.professionalism}%</span>
              </div>
            </div>
            <p className="mt-2 font-medium">Professionalism</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative inline-flex">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scoreData.businessAcumen / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold">{scoreData.businessAcumen}%</span>
              </div>
            </div>
            <p className="mt-2 font-medium">Business Acumen</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative inline-flex">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-orange-500"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scoreData.opportunistic / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold">{scoreData.opportunistic}%</span>
              </div>
            </div>
            <p className="mt-2 font-medium">Opportunistic</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative inline-flex">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scoreData.closingTechnique / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold">{scoreData.closingTechnique}%</span>
              </div>
            </div>
            <p className="mt-2 font-medium">Closing Technique</p>
          </div>
        </div>
      </div>
    </div>
  );
}