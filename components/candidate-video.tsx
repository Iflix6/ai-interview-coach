// components/CandidateVideo.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, Upload, X, Play, Square } from "lucide-react";

interface CandidateVideoProps {
  userInfo: {
    name: string;
    image: string | null;
  };
  onTranscriptionUpdate: (transcription: string, questionIndex: number) => void;
  currentQuestionIndex: number;
}

export default function CandidateVideo({
  userInfo,
  onTranscriptionUpdate,
  currentQuestionIndex,
}: CandidateVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showOverlayText, setShowOverlayText] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);

  // Debounce transcription updates to avoid frequent updates
  const debouncedTranscriptionUpdate = useCallback(
    (text: string, index: number) => {
      const timeout = setTimeout(() => {
        onTranscriptionUpdate(text, index);
      }, 1000);
      return () => clearTimeout(timeout);
    },
    [onTranscriptionUpdate]
  );

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        const combinedTranscript = finalTranscript + interimTranscript;
        setTranscription(combinedTranscript);
        setIsTranscribing(true);
        debouncedTranscriptionUpdate(combinedTranscript, currentQuestionIndex);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setTranscriptionError(
          event.error === "no-speech"
            ? "No speech detected. Please speak louder or check your microphone."
            : "Transcription failed. Please ensure your browser supports speech recognition."
        );
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
        if (micEnabled && (cameraEnabled || uploadedVideo) && isPlaying) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    } else {
      setTranscriptionError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentQuestionIndex, debouncedTranscriptionUpdate]);

  // Start camera and audio processing
  const startCamera = async () => {
    try {
      setUploadedVideo(null);
      setTranscription("");
      setTranscriptionError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micEnabled,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setCameraEnabled(true);
      setIsPlaying(true);

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);
      sourceRef.current = source;
      audioContextRef.current = audioContext;

      if (recognitionRef.current && micEnabled) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setTranscriptionError("Failed to access camera or microphone.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setCameraEnabled(false);
      setIsPlaying(false);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (uploadedVideo) {
      setUploadedVideo(null);
      startCamera();
    } else if (cameraEnabled) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    setMicEnabled(!micEnabled);

    if (cameraEnabled && stream && !uploadedVideo) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }

    if (recognitionRef.current) {
      if (!micEnabled) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      stopCamera();
      setTranscription("");
      setTranscriptionError(null);

      const videoURL = URL.createObjectURL(file);
      setUploadedVideo(videoURL);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowUploadOverlay(false);
      setIsPlaying(true);
      setTimeElapsed(0);

      if (videoRef.current) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(videoRef.current);
        sourceRef.current = source;
        audioContextRef.current = audioContext;

        if (recognitionRef.current && micEnabled) {
          recognitionRef.current.start();
        }
      }
    }
  };

  // Handle play/pause for uploaded video
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        if (recognitionRef.current && micEnabled) {
          recognitionRef.current.start();
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
    }
  };

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Format time as mm:ss:ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}:00`;
  };

  // Hide overlay text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [stream, uploadedVideo]);

  // Auto-start camera on component mount
  useEffect(() => {
    startCamera();
  }, []);

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

  // Handle video timeupdate event
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current && uploadedVideo) {
        setTimeElapsed(Math.floor(videoRef.current.currentTime));
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [uploadedVideo]);

  return (
    <div className="relative w-full h-full bg-gray-900">
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

      {showUploadOverlay && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Upload Video</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowUploadOverlay(false)}
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

      {/* Transcription status overlay */}
      {transcriptionError && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-red-500/80 text-white text-center">
          <p className="text-sm">{transcriptionError}</p>
        </div>
      )}
      {isTranscribing && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-green-500/80 text-white text-center">
          <p className="text-sm">Transcribing your response...</p>
        </div>
      )}

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
          onChange={(e) => setVolume(Number.parseInt(e.target.value))}
          className="w-24 h-4 mt-2 -rotate-90 absolute opacity-0 cursor-pointer"
          style={{ transform: "translateY(60px) rotate(-90deg)" }}
        />
        <div className="w-4 h-4 bg-white rounded-full mt-2 cursor-pointer"></div>
      </div>

      {showOverlayText && (
        <div className="absolute bottom-16 left-0 right-0 p-4 bg-black/40 text-white">
          <p className="text-sm text-center">
            I'm extremely excited to pursue a role that translates my in my professional life.
          </p>
        </div>
      )}

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
              onClick={() => setShowUploadOverlay(true)}
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
                  {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setUploadedVideo(null);
                    startCamera();
                  }}
                  className="border-white/20 bg-black/50 hover:bg-black/70 text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

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
            {uploadedVideo
              ? isPlaying
                ? "Playing uploaded video"
                : "Paused"
              : isPlaying
              ? "Online"
              : "Camera off"}
          </p>
        </div>
      </div>
    </div>
  );
}