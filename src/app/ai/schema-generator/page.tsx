"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import LoadingBattle from "@/components/loading"
import { Table } from "@/components/ui/table"

import { Mail, Hash, FileText, Key, List, FileText as RichTextIcon } from "lucide-react"


export default function AISchemaGeneratorPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [schemas, setSchemas] = useState<any[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const FIELD_TYPE_MAP: Record<string, { icon: JSX.Element; label: string; desc: string }> = {
    String: { icon: <FileText className="w-5 h-5 text-blue-500" />, label: "Text", desc: "Small or long text" },
    Email: { icon: <Mail className="w-5 h-5 text-orange-500" />, label: "Email", desc: "Email field" },
    Number: { icon: <Hash className="w-5 h-5 text-red-500" />, label: "Number", desc: "Numbers (integer, float, decimal)" },
    Password: { icon: <Key className="w-5 h-5 text-orange-500" />, label: "Password", desc: "Password field" },
    Enum: { icon: <List className="w-5 h-5 text-pink-500" />, label: "Enumeration", desc: "List of values" },
    RichText: { icon: <RichTextIcon className="w-5 h-5 text-orange-500" />, label: "Rich Text", desc: "Rich text editor" },
  }
  
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [prompt])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)

    try {
      const response = await fetch("http://localhost:8080/api/generate-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate schema")
      }

      const { schemas } = await response.json()
      console.log("Generated schemas:", schemas)
      setSchemas(schemas)
    } catch (error) {
      console.error(error)
      alert("Error generating schema. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApprove = async (schema: any) => {
    try {
      const response = await fetch("http://localhost:8080/api/processSchema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...schema, decision: "approve" }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve schema")
      }

      alert("Schema approved and saved successfully!")
      setSchemas(schemas.filter((s) => s.name !== schema.name))
    } catch (error) {
      console.error(error)
      alert("Error approving schema. Please try again.")
    }
  }

  const handleReject = (schemaName: string) => {
    setSchemas(schemas.filter((s) => s.name !== schemaName))
    alert("Schema rejected successfully!")
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
              <h1 className="text-4xl font-bold tracking-tight">
                AI Schema Generator
              </h1>
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
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">
                      Ctrl + Enter
                    </kbd>{" "}
                    to generate
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

            {/* Schema Table */}
            {schemas.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th className="text-left align-top w-40">Name</th>
                    <th className="text-left align-top">Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {schemas.map((schema) => (
                    <tr key={schema.name} className="align-top">
                      <td className="py-4 font-semibold">{schema.name}</td>
                      <td className="py-4">
                        <div
                          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto max-w-md text-xs"
                          style={{ maxHeight: 200 }}
                        >
                          <td className="py-4">
                            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                              {Object.entries(schema.fields).map(
                                ([fieldName, field]) => {
                                  // Guess type for icon mapping
                                  const typeKey =
                                    field.type === "String" && field.unique
                                      ? "Email"
                                      : field.type;
                                  const fieldType =
                                    FIELD_TYPE_MAP[typeKey] ||
                                    FIELD_TYPE_MAP.String;
                                  return (
                                    <div
                                      key={fieldName}
                                      className="flex w-full items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-800"
                                    >
                                      {fieldType.icon}
                                      <div>
                                        <div className="font-medium">
                                          {fieldName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {fieldType.label}
                                          {field.required ? " • Required" : ""}
                                          {field.unique ? " • Unique" : ""}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </td>
                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
                      Generated {schemas.length} schema
                      {schemas.length > 1 ? "s" : ""}
                    </td>
                  </tr>
                </tfoot>

              </Table>
            )}
          </div>
        </main>
      </div>

      {isGenerating && <LoadingBattle />}
    </div>
  );
}
