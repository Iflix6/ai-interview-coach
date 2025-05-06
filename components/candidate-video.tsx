"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Video, Upload, X, Play, Square } from "lucide-react"

interface CandidateVideoProps {
  userInfo: {
    name: string
    image: string | null
  }
}

export default function CandidateVideo({ userInfo }: CandidateVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showOverlayText, setShowOverlayText] = useState(true)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showUploadOverlay, setShowUploadOverlay] = useState(false)

  // Start camera
  const startCamera = async () => {
    try {
      // Clear any uploaded video first
      setUploadedVideo(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micEnabled,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setStream(mediaStream)
      setCameraEnabled(true)
      setIsPlaying(true)
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
      setIsPlaying(false)
    }
  }

  // Toggle camera
  const toggleCamera = () => {
    if (uploadedVideo) {
      // If we have an uploaded video, remove it and start camera
      setUploadedVideo(null)
      startCamera()
    } else if (cameraEnabled) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  // Toggle microphone
  const toggleMic = () => {
    setMicEnabled(!micEnabled)

    // If camera is already on, update the stream with new audio settings
    if (cameraEnabled && stream && !uploadedVideo) {
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      // Stop camera if it's running
      stopCamera()
      
      // Create URL for the uploaded video
      const videoURL = URL.createObjectURL(file)
      setUploadedVideo(videoURL)
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
      setShowUploadOverlay(false)
      setIsPlaying(true)
      
      // Reset timer
      setTimeElapsed(0)
    }
  }

  // Toggle upload overlay
  const toggleUploadOverlay = () => {
    setShowUploadOverlay(!showUploadOverlay)
  }

  // Remove uploaded video
  const removeUploadedVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo)
      setUploadedVideo(null)
      startCamera()
    }
  }

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

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
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo)
      }
    }
  }, [stream, uploadedVideo])

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

  // Handle video timeupdate event
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current && uploadedVideo) {
        setTimeElapsed(Math.floor(videoRef.current.currentTime))
      }
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [uploadedVideo])

  // Handle play/pause for uploaded video
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Video element */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay={!uploadedVideo}
          playsInline
          muted={!uploadedVideo || !micEnabled}
          className="w-full h-full object-cover"
          onContextMenu={(e) => e.preventDefault()}
          src={uploadedVideo || undefined}
          onClick={uploadedVideo ? handleVideoPlayPause : undefined}
        />
        
        {/* Play/Pause overlay for uploaded videos */}
        {uploadedVideo && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={handleVideoPlayPause}
          >
            {!isPlaying && (
              <div className="bg-green-500 rounded-full p-4 bg-opacity-80">
                <Play className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload overlay */}
      {showUploadOverlay && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Upload Video</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleUploadOverlay}
                className="border-white/20 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700"
            />
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: MP4, WebM, MOV (max 100MB)
            </p>
          </div>
        </div>
      )}

      {/* Volume slider */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-32 flex flex-col items-center">
        <div className="w-1 h-32 bg-white/30 rounded-full relative">
          <div
            className="w-1 bg-green-400 rounded-full absolute bottom-0"
            style={{ height: `${volume}%` }}
          ></div>
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

      {/* Overlay with controls */}
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
              <Mic className={micEnabled ? "h-4 w-4" : "h-4 w-4 opacity-50"} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCamera}
              className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
            >
              <Video className={isPlaying && !uploadedVideo ? "h-4 w-4" : "h-4 w-4 opacity-50"} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleUploadOverlay}
              className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
            >
              <Upload className="h-4 w-4" />
            </Button>
            {uploadedVideo && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVideoPlayPause}
                  className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
                >
                  {isPlaying ? (
                    <Square className="h-3 w-3" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={removeUploadedVideo}
                  className="border-white/20 bg-black/50 hover:bg-black/70 text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User info overlay */}
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
          <p className="text-xs text-white/70">
            {uploadedVideo ? (isPlaying ? "Playing uploaded video" : "Paused") : (isPlaying ? "Online" : "Camera off")}
          </p>
        </div>
      </div>
    </div>
  )
}