"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Video } from "lucide-react"

interface CandidateVideoProps {
  userInfo: {
    name: string
    image: string | null
  }
}

export default function CandidateVideo({ userInfo }: CandidateVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showOverlayText, setShowOverlayText] = useState(true)
  const [currentTime, setCurrentTime] = useState<string>("")

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micEnabled,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setStream(mediaStream)
      setCameraEnabled(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStream(null)
      setCameraEnabled(false)
    }
  }

  // Toggle camera
  const toggleCamera = () => {
    if (cameraEnabled) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  // Toggle microphone
  const toggleMic = () => {
    setMicEnabled(!micEnabled)

    // If camera is already on, update the stream with new audio settings
    if (cameraEnabled && stream) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }
  }

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (cameraEnabled) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [cameraEnabled])

  // Format time as mm:ss:ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}:00`
  }

  // Hide overlay text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // Auto-start camera on component mount
  useEffect(() => {
    startCamera()
  }, [])

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const month = now.toLocaleString("default", { month: "short" })
      setCurrentTime(`${month} ${hours}:${minutes}`)
    }

    // Update immediately
    updateTime()

    // Then update every minute
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Video element - now full width */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"   onContextMenu={e => e.preventDefault()}/>

      {/* Volume slider - exactly matching the image */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-32 flex flex-col items-center">
        <div className="w-1 h-32 bg-white/30 rounded-full relative">
          <div className="w-1 bg-green-400 rounded-full absolute bottom-0" style={{ height: `${volume}%` }}></div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange([Number.parseInt(e.target.value)])}
          className="w-24 h-4 mt-2 -rotate-90 absolute opacity-0 cursor-pointer"
          style={{ transform: "translateY(60px) rotate(-90deg)" }}
        />
        <div className="w-4 h-4 bg-white rounded-full mt-2 cursor-pointer"></div>
      </div>

      {/* Overlay with text - hidden after 5 seconds */}
      {showOverlayText && (
        <div className="absolute bottom-16 left-0 right-0 p-4 bg-black/40 text-white">
          <p className="text-sm text-center">
            I'm extremely excited to pursue a role that translates my in my professional life.
          </p>
        </div>
      )}

      {/* Overlay with controls - exactly matching the image */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">{formatTime(timeElapsed)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMic}
              className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCamera}
              className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User info overlay - using the user's provided name and image */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
          {userInfo.image ? (
            <img
              src={userInfo.image || "/placeholder.svg"}
              className="w-8 h-8 rounded-full object-cover"
              alt={userInfo.name}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {userInfo.name} <span className="opacity-70">{currentTime}</span>
          </p>
          <p className="text-xs text-white/70">Online</p>
        </div>
      </div>
    </div>
  )
}
