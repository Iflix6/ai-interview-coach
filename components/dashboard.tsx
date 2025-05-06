"use client"

import { useState, useEffect } from "react"
import CandidateVideo from "@/components/candidate-video"
import QuestionList from "@/components/question-list"
import AIResults from "@/components/ai-results"
import ChatInterface from "@/components/chat-interface"

interface DashboardProps {
  userInfo: {
    name: string
    image: string | null
  }
}

export default function Dashboard({ userInfo }: DashboardProps) {
  const [interviewStarted, setInterviewStarted] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(true)

  // Questions for the interview - exactly matching the image
  const questions = [
    "Tell us about yourself?",
    "Why do you think you are good at sales?",
    "What is the biggest deal you have closed?",
    "Why you choose this company?",
    "What your expectation is",
  ]

  // Start the interview
  const startInterview = () => {
    setInterviewStarted(true)
    setCurrentQuestionIndex(0)
    setShowResults(true)
  }

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  useEffect(() => {
    // Auto-start the interview to match the image
    startInterview()
  }, [])

  return (
    <div className="flex h-screen bg-white">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Video section */}
        <div className="flex h-[55%]">
          {/* Candidate video (Section 1) - now full width */}
          <div className="w-full h-full relative">
            <CandidateVideo userInfo={userInfo} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex h-[45%]">
          {/* Question list (Section 3) */}
          <div className="w-[30%] p-4 border-r border-gray-200">
            <QuestionList
              questions={questions}
              currentIndex={currentQuestionIndex}
              onNext={nextQuestion}
              showResults={showResults}
            />
          </div>

          {/* Results section (Sections 4 & 5) */}
          <div className="w-[70%] p-4">
            <AIResults showResults={showResults} />
          </div>
        </div>
      </div>

      {/* Chat sidebar (Section 6) */}
      <div className="w-[300px] border-l border-gray-200 flex flex-col">
        <ChatInterface userInfo={userInfo} />
      </div>
    </div>
  )
}
