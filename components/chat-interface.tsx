"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

interface ChatInterfaceProps {
  userInfo: {
    name: string;
    image: string | null;
  };
}

export default function ChatInterface({ userInfo }: ChatInterfaceProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello, ${userInfo.name}!`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(input);

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);

      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInput,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from Gemini API");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.log("Falling back to mock responses", error);

      const lowerInput = userInput.toLowerCase();

      if (lowerInput.includes("prepare") || lowerInput.includes("advice")) {
        return "To prepare for your interview, research the company thoroughly, practice common interview questions, and prepare examples of your achievements. Also, make sure to get a good night's sleep before the big day!";
      } else if (lowerInput.includes("nervous") || lowerInput.includes("anxiety")) {
        return "It's normal to feel nervous before an interview. Try deep breathing exercises, visualize success, and remember that the interview is also an opportunity for you to evaluate if the company is a good fit for you.";
      } else if (lowerInput.includes("question") || lowerInput.includes("ask")) {
        return "Some common interview questions include: 'Tell me about yourself', 'Why do you want this job?', 'What are your strengths and weaknesses?', and 'Where do you see yourself in 5 years?'. Prepare concise answers with specific examples.";
      } else {
        return "I'm here to help you prepare for your interview. Feel free to ask about specific interview questions, techniques for answering different types of questions, or advice on how to present yourself professionally.";
      }
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            {userInfo.image ? (
              <AvatarImage src={userInfo.image || "/placeholder.svg"} className="object-cover" />
            ) : (
              <AvatarFallback>{userInfo.name.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium">{userInfo.name}</p>
            <p className="text-xs text-gray-500">Interview Candidate</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex flex-col flex-1" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 h-9 px-3 py-1 shrink-0">
          <TabsTrigger value="record" className="text-xs">
            Record
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs">
            Chat
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            Notes
          </TabsTrigger>
          <TabsTrigger value="docs" className="text-xs">
            Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="flex-1 p-3 overflow-y-auto">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Recording features will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex flex-col flex-1 p-0 data-[state=active]:flex">
          <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Write your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Interview Tips</h4>
              <p className="text-xs text-gray-600">
                Research the company before the interview. Prepare examples of your achievements. Dress professionally.
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Common Questions</h4>
              <p className="text-xs text-gray-600">
                Why do you want this job? What are your strengths and weaknesses? Tell me about a time you faced a
                challenge at work.
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <h4 className="text-sm font-medium mb-1 text-blue-700">No worries, take your time 😊</h4>
              <p className="text-xs text-blue-600">You can always ask me for help.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="flex-1 p-3 overflow-y-auto">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Documentation will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}