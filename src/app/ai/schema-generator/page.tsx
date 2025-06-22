"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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

    // Auto-resize textarea
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
        // Redirect to content type builder with the generated schema
        router.push("/content-types/builder")
    }

    const handleCancel = () => {
        setIsGenerating(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Generate on Ctrl/Cmd + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            handleGenerate()
        }
    }

    return (
        <div className="flex h-screen bg-[#f6f6f9]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="AI Schema Generator" />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        {/* Simple centered layout */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Schema Generator</h1>
                            <p className="text-gray-600">Describe your content structure and let AI build it for you</p>
                        </div>

                        {/* Main input area */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="schema-prompt" className="block text-sm font-medium text-gray-700 mb-3">
                                        What do you want to build?
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        id="schema-prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Describe your content management needs...

For example:
• Create a blog with posts, authors, and categories
• Build an e-commerce product catalog
• Design a restaurant menu system
• Make a project management tool"
                                        className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-hidden transition-all duration-200"
                                        style={{ minHeight: "120px" }}
                                    />
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-sm text-gray-500">
                                            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + Enter</kbd> to generate
                                        </p>
                                        <p className="text-sm text-gray-400">{prompt.length} characters</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim()}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Brain className="w-5 h-5 mr-2" />
                                    Generate Schema
                                </Button>
                            </div>
                        </div>

                        {/* Quick examples */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 mb-4">Quick examples:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {[
                                    "Blog with posts and authors",
                                    "E-commerce product catalog",
                                    "Restaurant menu system",
                                    "Project management tool",
                                    "Real estate listings",
                                ].map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPrompt(example)}
                                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* AI Loading Screen */}
            {isGenerating && <LoadingBattle />}
        </div>
    )
}
