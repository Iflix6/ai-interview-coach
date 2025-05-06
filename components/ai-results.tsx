"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface AIResultsProps {
  showResults: boolean
}

export default function AIResults({ showResults }: AIResultsProps) {
  const [activeTab, setActiveTab] = useState("score")

  // Mock data for the results - exactly matching the image
  const scoreData = {
    overall: 85,
    professionalism: 80,
    businessAcumen: 90,
    opportunistic: 65,
    closingTechnique: 85,
  }

  // If results are not ready to be shown, display a placeholder
  if (!showResults) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">AI Video Score Detail</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-6 bg-gray-50 rounded-lg">
          <div>
            <p className="text-gray-500 mb-2">Complete the interview to see your results</p>
            <p className="text-sm text-gray-400">The AI will analyze your performance and provide detailed feedback</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500">AI Video Score Detail</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Left column - Score summary */}
        <div className="flex flex-col">
          {/* Overall Score - exactly matching the image */}
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gray-800">{scoreData.overall}%</div>
            <h4 className="text-lg font-medium mt-2">AI Video Score Summary</h4>
            <p className="text-sm text-gray-600 mt-2">
              The presentation of sales is good. Check the breakdown summary of AI Video Score.
            </p>
          </div>

          {/* Accept/Reject buttons - exactly matching the image */}
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
            <Button variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50">
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>

          {/* Next button - exactly matching the image */}
          <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">See Next</Button>
        </div>

        {/* Right column - Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Professionalism Score */}
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

          {/* Business Acumen Score */}
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

          {/* Opportunistic Score */}
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

          {/* Closing Technique Score */}
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
  )
}
