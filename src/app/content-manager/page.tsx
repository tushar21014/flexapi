"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Database, FileText, Users, ShoppingCart, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ContentType {
  id: string
  name: string
  displayName: string
  description: string
  icon: any
  count: number
}

export default function ContentManagerPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

    const handleGetSchemas = async() => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SCHEMA_URL}/getSchemas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch content types")
        }
        const data = await response.json()
        setContentTypes(data || [])
        console.log("Content types fetched:", data)
      } catch (error) {
        console.error("Error fetching content types:", error)
        // Redirect to login on error
        // window.location.href = "/login"
      }
  
    }



    const filteredContentTypes = contentTypes.filter(
        (ct) =>
          ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ct.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
  
    useEffect(() => {
      // Fetch content types when the component mounts
      handleGetSchemas()
    }
    , []);



    const handleContentTypeClick = (contentType: ContentType) => {
        router.push(`/content-manager/${contentType.id}?displayName=${encodeURIComponent(contentType.name)}`)
      }
      

  return (
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Content Manager" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
              <p className="text-gray-600">Manage and edit your content</p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Content Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContentTypes.map((contentType) => {
                const Icon = contentType.icon || Database
                return (
                  <Card
                    key={contentType.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleContentTypeClick(contentType)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#4945ff] rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg text-gray-900">{contentType.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{contentType.description}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">{contentType.recordCount}</span>
                            <span className="ml-1">entries</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredContentTypes.length === 0 && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content types found</h3>
                <p className="text-gray-600">Try adjusting your search or create a new content type</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
