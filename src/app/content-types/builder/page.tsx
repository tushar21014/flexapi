"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FieldTypeSelector } from "@/components/field-type-selector"
import { Plus, Save, ArrowLeft, Trash2, Edit } from "lucide-react"

interface Field {
  id: string
  name: string
  displayName: string
  type: string
  required: boolean
  unique: boolean
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
  const [selectedFieldType, setSelectedFieldType] = useState<any>(null)
  const [fieldForm, setFieldForm] = useState({
    name: "",
    displayName: "",
    required: false,
    unique: false,
    description: "",
  })

  const handleAddField = () => {
    if (selectedFieldType && fieldForm.name) {
      const newField: Field = {
        id: Date.now().toString(),
        name: fieldForm.name,
        displayName: fieldForm.displayName || fieldForm.name,
        type: selectedFieldType.type,
        required: fieldForm.required,
        unique: fieldForm.unique,
        description: fieldForm.description,
      }
      setFields((prev) => [...prev, newField])
      setIsFieldDialogOpen(false)
      setSelectedFieldType(null)
      setFieldForm({
        name: "",
        displayName: "",
        required: false,
        unique: false,
        description: "",
      })
    }
  }

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id))
  }

  const api = process.env.NEXT_PUBLIC_SCHEMA_URL

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("You must be logged in.")
      return
    }
  
    // Build fields object from array of fields
    const fieldsObj = fields.reduce((acc: { [key: string]: string }, field) => {
      acc[field.name] = field.type
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
  
    if (res.ok) {
      const result = await res.json()
      console.log("Schema created:", result)
      router.push("/content-types")
    } else {
      const error = await res.json()
      alert("Failed to create schema: " + error.message)
    }
  }
  
  return (
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
                      <DialogTitle>
                        {selectedFieldType ? `Configure ${selectedFieldType.name} Field` : "Select a field type"}
                      </DialogTitle>
                    </DialogHeader>

                    {!selectedFieldType ? (
                      <div className="py-4">
                        <h3 className="text-lg font-medium mb-4">Select a field for your collection type</h3>
                        <FieldTypeSelector onSelectField={setSelectedFieldType} />
                      </div>
                    ) : (
                      <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <Input
                              value={fieldForm.name}
                              onChange={(e) => setFieldForm((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Field name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                            <Input
                              value={fieldForm.displayName}
                              onChange={(e) => setFieldForm((prev) => ({ ...prev, displayName: e.target.value }))}
                              placeholder="Display name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <Textarea
                            value={fieldForm.description}
                            onChange={(e) => setFieldForm((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Field description"
                            rows={2}
                          />
                        </div>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={fieldForm.required}
                              onChange={(e) => setFieldForm((prev) => ({ ...prev, required: e.target.checked }))}
                              className="mr-2"
                            />
                            Required field
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={fieldForm.unique}
                              onChange={(e) => setFieldForm((prev) => ({ ...prev, unique: e.target.checked }))}
                              className="mr-2"
                            />
                            Unique field
                          </label>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setSelectedFieldType(null)}>
                            Back
                          </Button>
                          <Button onClick={handleAddField} className="bg-[#4945ff] hover:bg-[#3730ff]">
                            Add Field
                          </Button>
                        </div>
                      </div>
                    )}
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
                          <div className="w-8 h-8 bg-[#4945ff] rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{field.type.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{field.displayName}</h4>
                            <p className="text-sm text-gray-500">
                              {field.name} • {field.type}
                              {field.required && " • Required"}
                              {field.unique && " • Unique"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
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
    </div>
  )
}
