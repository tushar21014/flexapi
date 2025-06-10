"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Database } from "lucide-react"
import Link from "next/link"

interface ContentType {
  id: string
  name: string
  displayName: string
  description: string
  fields: number
  entries: number
  createdAt: string
}

export default function ContentTypesPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([
    {
      id: "1",
      name: "product",
      displayName: "Product",
      description: "Product information and details",
      fields: 8,
      entries: 45,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "article",
      displayName: "Article",
      description: "Blog articles and news",
      fields: 6,
      entries: 23,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "category",
      displayName: "Category",
      description: "Product and content categories",
      fields: 4,
      entries: 12,
      createdAt: "2024-01-08",
    },
    {
      id: "4",
      name: "user",
      displayName: "User",
      description: "User profiles and information",
      fields: 10,
      entries: 156,
      createdAt: "2024-01-05",
    },
    {
      id: "5",
      name: "order",
      displayName: "Order",
      description: "Customer orders and transactions",
      fields: 12,
      entries: 89,
      createdAt: "2024-01-03",
    },
  ])

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

  useEffect(() => {
    // Fetch content types when the component mounts
    handleGetSchemas()
  }
  , []);

  const handleDelete = (id: string) => {
    setContentTypes((prev) => prev.filter((ct) => ct.id !== id))
  }

  return (
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Content Types" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Content Types</h2>
                <p className="text-gray-600">Manage your content structure and schemas</p>
              </div>
              <Link href="/content-types/builder">
                <Button className="bg-[#4945ff] hover:bg-[#3730ff]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content Type
                </Button>
              </Link>
            </div>

            {/* Content Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentTypes.map((contentType) => (
                <Card key={contentType.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#4945ff] rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contentType.displayName}</CardTitle>
                          <p className="text-sm text-gray-500">{contentType.name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contentType.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{contentType.description}</p>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{contentType.fields}</span>
                        <span className="text-gray-500 ml-1">fields</span>
                      </div>
                      <div>
                        <span className="font-medium">{contentType.recordCount}</span>
                        <span className="text-gray-500 ml-1">entries</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Created {new Date(contentType.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {contentTypes.length === 0 && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content types yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first content type</p>
                <Link href="/content-types/builder">
                  <Button className="bg-[#4945ff] hover:bg-[#3730ff]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content Type
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
