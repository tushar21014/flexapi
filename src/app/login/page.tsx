"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from 'react-hot-toast';
import { EyeClosedIcon, EyeIcon } from "lucide-react"

export default function LoginPage() {
  const api = process.env.NEXT_PUBLIC_USER_URL;
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - redirect to dashboard
    const res = await fetch(`${api}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json();
    if (!res.ok) {
      // Handle error (e.g., show notification)
      toast.error(data.message || "Login failed. Please try again.");
      console.error("Login failed:", data.message);
      return;
    }
    // if (!res.ok) {
    //   // Handle error (e.g., show notification)
    //   console.error("Login failed:", data.message)
    //   return
    // }

    localStorage.setItem("token", data.token)
    console.log("Login successful:", data)
    router.push("/dashboard")
  }

  return (
    <>
    <Toaster/>
    <div className="min-h-screen bg-[#f6f6f9] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#4945ff] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
          <p className="text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                  ) : (
                    <EyeClosedIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#4945ff] hover:bg-[#3730ff]">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#4945ff] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
