"use client";

import { useState, useEffect } from "react";
import CandidateVideo from "@/components/candidate-video";
import AIVideo from "@/components/ai-video";
import QuestionList from "@/components/question-list";
import AIResults from "@/components/ai-results";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Mic, Video, MessageSquare, Volume2, PhoneOff, MessageCircle } from "lucide-react";

interface DashboardProps {
  userInfo: {
    name: string;
    image: string | null;
  };
}

export default function Dashboard({ userInfo }: DashboardProps) {
  const [interviewStarted, setInterviewStarted] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const questions = [
    "Tell us about yourself?",
    "Why do you think you are good at sales?",
    "What is the biggest deal you have closed?",
    "Why you choose this company?",
    "What your expectation is",
  ];

  useEffect(() => {
    setAnsweredQuestions(new Array(questions.length).fill(false));
  }, []);

  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setAnswers([]);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleTranscriptionUpdate = (transcription: string, questionIndex: number) => {
    if (transcription.trim()) {
      setAnswers((prev) => {
        const existingAnswerIndex = prev.findIndex(
          (a) => a.question === questions[questionIndex]
        );
        if (existingAnswerIndex !== -1) {
          const updatedAnswers = [...prev];
          updatedAnswers[existingAnswerIndex] = {
            question: questions[questionIndex],
            answer: transcription,
          };
          return updatedAnswers;
        } else {
          return [...prev, { question: questions[questionIndex], answer: transcription }];
        }
      });

      setAnsweredQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = true;
        return updated;
      });
    }
  };

  const toggleMic = () => setMicEnabled(!micEnabled);
  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const endCall = () => {
    setInterviewStarted(false);
    setShowResults(true);
  };
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    startInterview();
  }, []);

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#D3D3D3" }}>
      {/* Left Section: QuestionList and AIResults */}
      <div className="w-[27%] flex flex-col p-2">
        <div className="bg-white rounded-lg shadow-lg mb-4 p-4">
          <QuestionList
            questions={questions}
            currentIndex={currentQuestionIndex}
            onNext={nextQuestion}
            showResults={showResults}
            answeredQuestions={answeredQuestions}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <AIResults showResults={showResults} answers={answers} />
        </div>
      </div>

      {/* Middle Section: Video Frames */}
      <div
        className={`flex-1 flex flex-col p-6 transition-all duration-300 ${
          isChatOpen ? "mr-[300px]" : "mr-0"
        }`}
      >
        <div id="video-section" className="flex-1 flex flex-col">
          <div className="flex h-[80%] gap-4">
            <div className="w-[50%] rounded-lg overflow-hidden shadow-lg bg-white">
              <AIVideo userInfo={userInfo} />
            </div>
            <div className="w-[50%] rounded-lg overflow-hidden shadow-lg bg-white">
              <CandidateVideo
                userInfo={userInfo}
                onTranscriptionUpdate={handleTranscriptionUpdate}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          </div>
          {/* Control Bar */}
          <div className="h-[10%] mt-2 flex justify-center items-center gap-4 bg-white rounded-b-lg shadow-lg p-4">
            <Button
              onClick={toggleMic}
              className={`rounded-full p-3 transition-all duration-300 ${
                micEnabled
                  ? "bg-gray-200 hover:bg-gray-300 text-black"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <Mic className="h-6 w-6" />
            </Button>
            <Button
              onClick={toggleVideo}
              className={`rounded-full p-3 transition-all duration-300 ${
                videoEnabled
                  ? "bg-gray-200 hover:bg-gray-300 text-black"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              onClick={endCall}
              className="rounded-full p-3 bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button
              onClick={toggleChat}
              className="rounded-full p-3 bg-gray-200 hover:bg-gray-300 text-black transition-all duration-300"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Volume2 className="h-6 w-6 text-black" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF6200 0%, #FF6200 ${volume}%, #E5E7EB ${volume}%, #E5E7EB 100%)`,
                  "&::-webkit-slider-thumb": {
                    appearance: "none",
                    width: "12px",
                    height: "12px",
                    background: "#FF6200",
                    borderRadius: "50%",
                    cursor: "pointer",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Toggleable Chat Interface */}
      <div
        className={`fixed top-0 right-0 h-[690px] w-[300px] bg-white  transform transition-transform duration-300 ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-medium text-black">Chat</h3>
          <Button
            onClick={toggleChat}
            className="rounded-full p-2 bg-gray-200 hover:bg-gray-300 text-black"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 p-1 overflow-y-auto">
          <ChatInterface userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}