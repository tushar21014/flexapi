"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { FieldTypeSelector } from "@/components/field-type-selector"
import { Plus, Save, ArrowLeft, Trash2, Edit } from "lucide-react"
import { Label } from "@/components/ui/label"
import toast, { Toaster } from "react-hot-toast"

interface Field {
  id: string
  name: string
  displayName: string
  type: string
  required: boolean
  unique: boolean
  primaryKey?: boolean
  relatedContentType?: string,
  selectedRelation?: string, // "oneToOne", "oneToMany", "manyToMany"
  description?: string
  color?: string // Added color property
}

interface ContentType {
  id: string
  name: string
  displayName: string
  description?: string
}

export default function ContentTypeBuilderPage() {
  const router = useRouter()
  const [contentType, setContentType] = useState({
    name: "",
    displayName: "",
    description: "",
  })
  const [fields, setFields] = useState<Field[]>([])
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false)
  const [existingContentTypes, setExistingContentTypes] = useState<ContentType[] | undefined>()
  const api = process.env.NEXT_PUBLIC_SCHEMA_URL


  useEffect(() => {
    // Fetch existing content types when the component mounts
    handleGetSchemas()
  }, [])
  

  const handleGetSchemas = async () => {
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
      setExistingContentTypes(data || [])
      console.log("Content types fetched:", data)
    } catch (error) {
      console.error("Error fetching content types:", error)
      // Redirect to login on error
      // window.location.href = "/login"
    }

  }

  const handleAddField = (fieldData: any) => {
    console.log("Adding field:", fieldData)
    const newField: Field = {
      id: Date.now().toString(),
      ...fieldData,
    }
    setFields((prev) => [...prev, newField])
    setIsFieldDialogOpen(false)
  }

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("You must be logged in.")
      return
    }
  
    // Validate required fields
    if (!contentType.displayName.trim()) {
      toast.error("Display Name cannot be empty.")
      return
    }
    if (!contentType.name.trim()) {
      toast.error("API ID cannot be empty.")
      return
    }
    if (fields.length === 0) {
      toast.error("Schema must have at least one field.")
      return
    }
  
    // Build fields object from array of fields
    const fieldsObj = fields.reduce((acc: { [key: string]: any }, field) => {
      acc[field.name] = {
        type: field.type,
        required: field.required,
        unique: field.unique,
        primaryKey: field.primaryKey || false,
        relationSchema: field.relatedContentType,
        relationType: field.selectedRelation, // Default to oneToOne if not specified
      }
      return acc
    }, {})
  
    const payload = {
      name: contentType.name,
      description: contentType.description,
      fields: fieldsObj
    }
  
    console.log("Sending payload:", payload)
  
    const res = await fetch(`${api}/createSchema`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    })
  
    console.log("Response status:", res)
    if (res.ok) {
      const result = await res.json()
      console.log("Schema created successfully:", result["api"])
      setApiKey(result["api"] || "");
      setIsApiDialogOpen(true)
  
      // router.push("/content-types")
    } else {
      const error = await res.json()
      toast.error(error.error)
      // alert("Failed to create schema: " + error.error)
    }
  }

  const getRelatedContentTypeName = (id: string) => {
    if (!existingContentTypes) return id
    const contentType = existingContentTypes.find((ct) => ct.id === id)
    return contentType ? contentType.displayName : id
  }

  return (
    <>
    <Toaster/>
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Content Type Builder" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Content Type</h2>
                  <p className="text-gray-600">Define your content structure</p>
                </div>
              </div>
              <Button onClick={handleSave} className="bg-[#4945ff] hover:bg-[#3730ff]">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Content Type Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Content Type Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <Input
                      value={contentType.displayName}
                      onChange={(e) =>
                        setContentType((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                          name: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        }))
                      }
                      placeholder="e.g., Product"
                      required={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API ID (Singular)</label>
                    <Input
                      value={contentType.name}
                      onChange={(e) => setContentType((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., product"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea
                    value={contentType.description}
                    onChange={(e) => setContentType((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this content type represents"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fields */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fields</CardTitle>
                <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select a field type</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <FieldTypeSelector
                        onSelectField={handleAddField}
                        contentTypes={existingContentTypes || []}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No fields added yet. Click "Add Field" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 ${field.color || "bg-[#4945ff]"} rounded flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-bold">{field.type.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{field.displayName}</h4>
                            <p className="text-sm text-gray-500">
                              {field.name} • {field.type}
                              {field.type === "relation" && field.relatedContentType && (
                                <span> → {getRelatedContentTypeName(field.relatedContentType)}</span>
                              )}
                              {field.required && " • Required"}
                              {field.unique && " • Unique"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {/* <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteField(field.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      {isApiDialogOpen && (
        <Dialog open={isApiDialogOpen} onOpenChange={(open) => {
          setIsApiDialogOpen(open)
          if (!open) {
            router.push("/content-types")
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>API Key</DialogTitle>
              <DialogDescription>
                Anyone who has this key will be able to access schema.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={apiKey}
                  readOnly
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" onClick={() => (router.push("/content-types"))} variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </>

  )
}
