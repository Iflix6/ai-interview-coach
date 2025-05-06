"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MetricsDisplay() {
  const confidenceCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const clarityCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const relevanceCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const concisionCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Mock data for the metrics
  const metricsData = {
    confidence: 78,
    clarity: 85,
    relevance: 92,
    concision: 70,
    fillerWords: 12,
    averageResponseTime: "42 seconds",
    eyeContact: "Good",
    posture: "Excellent",
    enthusiasm: "Moderate",
  }

  // Draw gauge chart
  const drawGauge = (canvas: HTMLCanvasElement, value: number, color: string) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height - 20
    const radius = Math.min(centerX, centerY) - 10

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Draw value arc
    const angle = Math.PI - (value / 100) * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, true)
    ctx.lineWidth = 20
    ctx.strokeStyle = color
    ctx.stroke()

    // Draw value text
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.fillText(`${value}%`, centerX, centerY + 10)

    // Draw label
    ctx.font = "14px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.fillText("Score", centerX, centerY - radius - 15)
  }

  useEffect(() => {
    // Draw gauges when component mounts
    if (confidenceCanvasRef.current) {
      drawGauge(confidenceCanvasRef.current, metricsData.confidence, "#3b82f6")
    }

    if (clarityCanvasRef.current) {
      drawGauge(clarityCanvasRef.current, metricsData.clarity, "#10b981")
    }

    if (relevanceCanvasRef.current) {
      drawGauge(relevanceCanvasRef.current, metricsData.relevance, "#8b5cf6")
    }

    if (concisionCanvasRef.current) {
      drawGauge(concisionCanvasRef.current, metricsData.concision, "#f59e0b")
    }
  }, [metricsData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gauges">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gauges">Score Gauges</TabsTrigger>
            <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="gauges" className="pt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <canvas ref={confidenceCanvasRef} width="160" height="120"></canvas>
                <p className="mt-2 font-medium">Confidence</p>
              </div>

              <div className="flex flex-col items-center">
                <canvas ref={clarityCanvasRef} width="160" height="120"></canvas>
                <p className="mt-2 font-medium">Clarity</p>
              </div>

              <div className="flex flex-col items-center">
                <canvas ref={relevanceCanvasRef} width="160" height="120"></canvas>
                <p className="mt-2 font-medium">Relevance</p>
              </div>

              <div className="flex flex-col items-center">
                <canvas ref={concisionCanvasRef} width="160" height="120"></canvas>
                <p className="mt-2 font-medium">Concision</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Filler Words</p>
                  <p className="text-lg font-medium">{metricsData.fillerWords} instances</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Response Time</p>
                  <p className="text-lg font-medium">{metricsData.averageResponseTime}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eye Contact</p>
                  <p className="text-lg font-medium">{metricsData.eyeContact}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Posture</p>
                  <p className="text-lg font-medium">{metricsData.posture}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enthusiasm</p>
                  <p className="text-lg font-medium">{metricsData.enthusiasm}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Improvement Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Practice reducing filler words by pausing instead of saying "um" or "like"</li>
                  <li>Work on maintaining more consistent eye contact with the camera</li>
                  <li>Try to be more concise in your responses while still being thorough</li>
                  <li>Show more enthusiasm through vocal variety and facial expressions</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
