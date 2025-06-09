"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const fieldTypes = [
  {
    type: "text",
    name: "Text",
    description: "Small or long text like title or description",
    icon: "Ab",
    color: "bg-blue-500",
  },
  {
    type: "email",
    name: "Email",
    description: "Email field with validation format",
    icon: "@",
    color: "bg-orange-500",
  },
  {
    type: "richtext",
    name: "Rich Text",
    description: "A rich text editor with formatting options",
    icon: "Rt",
    color: "bg-orange-400",
  },
  {
    type: "password",
    name: "Password",
    description: "Password field with encryption",
    icon: "••",
    color: "bg-orange-500",
  },
  {
    type: "number",
    name: "Number",
    description: "Numbers (integer, float, decimal)",
    icon: "123",
    color: "bg-red-500",
  },
  {
    type: "enumeration",
    name: "Enumeration",
    description: "List of values, then pick one",
    icon: "En",
    color: "bg-pink-400",
  },
  {
    type: "date",
    name: "Date",
    description: "A date picker with hours, minutes and seconds",
    icon: "📅",
    color: "bg-blue-600",
  },
  {
    type: "media",
    name: "Media",
    description: "Files like images, videos, etc.",
    icon: "🎬",
    color: "bg-purple-500",
  },
  {
    type: "boolean",
    name: "Boolean",
    description: "Yes or no, 1 or 0, true or false",
    icon: "✓",
    color: "bg-green-500",
  },
  {
    type: "json",
    name: "JSON",
    description: "Data in JSON format",
    icon: "{}",
    color: "bg-teal-600",
  },
  {
    type: "relation",
    name: "Relation",
    description: "Refers to a Collection Type",
    icon: "🔗",
    color: "bg-blue-700",
  },
  {
    type: "uid",
    name: "UID",
    description: "Unique identifier",
    icon: "UID",
    color: "bg-orange-600",
  },
]

interface FieldSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (field: any) => void
}

export default function FieldSelector({ isOpen, onClose, onSelect }: FieldSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [fieldName, setFieldName] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const [isUnique, setIsUnique] = useState(false)

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  const handleSubmit = () => {
    if (!selectedType || !fieldName) return

    const fieldType = fieldTypes.find((f) => f.type === selectedType)
    const field = {
      name: fieldName,
      type: selectedType,
      required: isRequired,
      unique: isUnique,
      icon: fieldType?.icon,
      color: fieldType?.color,
    }

    onSelect(field)

    // Reset form
    setSelectedType(null)
    setFieldName("")
    setIsRequired(false)
    setIsUnique(false)
  }

  const handleClose = () => {
    setSelectedType(null)
    setFieldName("")
    setIsRequired(false)
    setIsUnique(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a field for your collection type</DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {fieldTypes.map((field) => (
              <button
                key={field.type}
                onClick={() => handleTypeSelect(field.type)}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${field.color}`}
                >
                  {field.icon}
                </div>
                <div>
                  <div className="font-medium">{field.name}</div>
                  <div className="text-sm text-gray-500">{field.description}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${fieldTypes.find((f) => f.type === selectedType)?.color}`}
              >
                {fieldTypes.find((f) => f.type === selectedType)?.icon}
              </div>
              <div>
                <div className="font-medium">{fieldTypes.find((f) => f.type === selectedType)?.name}</div>
                <div className="text-sm text-gray-600">
                  {fieldTypes.find((f) => f.type === selectedType)?.description}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fieldName">Name</Label>
                <Input
                  id="fieldName"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g., title, description, price"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={isRequired}
                    onCheckedChange={(checked) => setIsRequired(checked as boolean)}
                  />
                  <Label htmlFor="required">Required field</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unique"
                    checked={isUnique}
                    onCheckedChange={(checked) => setIsUnique(checked as boolean)}
                  />
                  <Label htmlFor="unique">Unique field</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setSelectedType(null)}>
                Back
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!fieldName}
                >
                  Add Field
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
