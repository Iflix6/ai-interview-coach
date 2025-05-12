"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface AIVideoProps {
  userInfo: {
    name: string;
    image: string | null;
  };
}

export default function AIVideo({ userInfo }: AIVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Handle play/pause for the AI video
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const month = now.toLocaleString("default", { month: "short" });
      setCurrentTime(`${month} ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play the video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.error("Auto-play failed:", err));
      setIsPlaying(true);
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900">
      <video
        ref={videoRef}
        loop
        muted
        className="w-full h-full object-cover"
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with actual AI video source
        onClick={handleVideoPlayPause}
      />
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

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
                AI Interviewer <span className="opacity-70">{currentTime}</span>
              </p>
              <p className="text-xs text-white/70">{isPlaying ? "Playing" : "Paused"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleVideoPlayPause}
              className="border-white/20 bg-black/50 hover:bg-black/70 text-green-400"
            >
              {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}