"use client"

import { useState, useEffect } from "react"
import WelcomePage from "@/components/welcome-page"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [userInfo, setUserInfo] = useState<{
    name: string
    image: string | null
  } | null>(null)

  // Check if user info exists in localStorage on component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo")
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo))
    }
  }, [])

  const handleUserInfoSubmit = (name: string, image: string | null) => {
    const newUserInfo = { name, image }
    setUserInfo(newUserInfo)
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo))
  }

  return (
    <div className="h-screen">
      {!userInfo ? <WelcomePage onSubmit={handleUserInfoSubmit} /> : <Dashboard userInfo={userInfo} />}
    </div>
  )
}
