"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import LoadingBattle from "@/components/loading"

export default function AISchemaGeneratorPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [prompt])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
  }

  const handleSchemaComplete = (schema: any) => {
    setIsGenerating(false)
    setPrompt("")
    router.push("/content-types/builder")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="flex h-screen bg-[#f9fafb] dark:bg-[#111827] text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="AI Schema Generator" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
            {/* Hero Section */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">AI Schema Generator</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Describe your content structure and let AI build it for you.
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-8 space-y-6">
              <div>
                <label
                  htmlFor="schema-prompt"
                  className="block text-sm font-semibold mb-2"
                >
                  What do you want to build?
                </label>
                <textarea
                  ref={textareaRef}
                  id="schema-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`e.g.\n• Blog with posts & authors\n• Product catalog\n• Menu system`}
                  className="w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden transition-all duration-200"
                  style={{ minHeight: "130px" }}
                />
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                  <span>
                    Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Ctrl + Enter</kbd> to generate
                  </span>
                  <span className="text-xs">{prompt.length} characters</span>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate Schema
              </Button>
            </div>

            {/* Quick Examples */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Try a quick example:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Blog with posts and authors",
                  "E-commerce product catalog",
                  "Restaurant menu system",
                  "Project management tool",
                  "Real estate listings",
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    className="px-4 py-1.5 rounded-full text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isGenerating && <LoadingBattle />}
    </div>
  )
}
