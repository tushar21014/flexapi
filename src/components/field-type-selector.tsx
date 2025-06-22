"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Type,
  Mail,
  Hash,
  Calendar,
  ToggleLeft,
  Link,
  FileText,
  List,
  ImageIcon,
  Code,
  Key,
  Component,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContentType {
  id: string
  name: string
  displayName: string
}

const fieldTypes = [
  {
    name: "Text",
    description: "Small or long text like title or description",
    icon: Type,
    color: "bg-blue-500",
    type: "text",
  },
  {
    name: "Email",
    description: "Email field with validation format",
    icon: Mail,
    color: "bg-orange-500",
    type: "email",
  },
  {
    name: "Rich Text",
    description: "A rich text editor with formatting options",
    icon: FileText,
    color: "bg-orange-400",
    type: "richtext",
  },
  {
    name: "Password",
    description: "Password field with encryption",
    icon: Key,
    color: "bg-orange-500",
    type: "password",
  },
  {
    name: "Number",
    description: "Numbers (integer, float, decimal)",
    icon: Hash,
    color: "bg-red-500",
    type: "number",
  },
  {
    name: "Enumeration",
    description: "List of values, then pick one",
    icon: List,
    color: "bg-pink-400",
    type: "enumeration",
  },
  {
    name: "Date",
    description: "A date picker with hours, minutes and seconds",
    icon: Calendar,
    color: "bg-blue-600",
    type: "date",
  },
  {
    name: "Media",
    description: "Files like images, videos, etc",
    icon: ImageIcon,
    color: "bg-purple-500",
    type: "media",
  },
  {
    name: "Boolean",
    description: "Yes or no, 1 or 0, true or false",
    icon: ToggleLeft,
    color: "bg-green-500",
    type: "boolean",
  },
  {
    name: "JSON",
    description: "Data in JSON format",
    icon: Code,
    color: "bg-teal-500",
    type: "json",
  },
  {
    name: "Relation",
    description: "Refers to a Collection Type",
    icon: Link,
    color: "bg-blue-500",
    type: "relation",
  },
  {
    name: "UID",
    description: "Unique identifier",
    icon: Key,
    color: "bg-orange-600",
    type: "uid",
  },
  {
    name: "Component",
    description: "Group of fields that you can repeat or reuse",
    icon: Component,
    color: "bg-gray-600",
    type: "component",
  },
  {
    name: "Dynamic Zone",
    description: "Dynamically pick component when editing",
    icon: Zap,
    color: "bg-gray-700",
    type: "dynamiczone",
  },
]

interface FieldTypeSelectorProps {
  onSelectField: (fieldType: any) => void
  contentTypes: ContentType[]
}

export function FieldTypeSelector({ onSelectField, contentTypes }: FieldTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<any>(null)
  const [fieldName, setFieldName] = useState("")
  const [fieldDisplayName, setFieldDisplayName] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const [isUnique, setIsUnique] = useState(false)
  const [isPrimaryKey, setIsPrimaryKey] = useState(false)
  const [relatedContentType, setRelatedContentType] = useState("")
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);

  useEffect(() => {
    // Update display name when field name changes
    if (fieldName) {
      // Convert camelCase or snake_case to Title Case
      const displayName = fieldName
        .replace(/([A-Z])/g, " $1") // Insert a space before all capital letters
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
        .trim()
      setFieldDisplayName(displayName)
    } else {
      setFieldDisplayName("")
    }
  }, [fieldName])

  const handleTypeSelect = (type: string) => {
    const fieldType = fieldTypes.find((f) => f.type === type)
    setSelectedType(fieldType)

    // Reset other form parts
    setIsRequired(false)
    setIsUnique(false)

    if (type !== "relation") {
      setRelatedContentType("")
    }
  }


  const handleSubmit = () => {
    if (!selectedType || !fieldName) return

    let fieldData = {
      name: fieldName,
      displayName: fieldDisplayName || fieldName,
      type: selectedType.type,
      required: isRequired,
      unique: isUnique,
      icon: selectedType.icon,
      color: selectedType.color,
      selectedRelation: selectedRelation,
    }

    // Add relation-specific data
    if (selectedType.type === "relation" && relatedContentType) {
      fieldData = {
        ...fieldData,
        relatedContentType,
      }
    }

    // For UID fields, automatically set unique to true
    if (selectedType.type === "uid") {
      fieldData = {
        ...fieldData,
        unique: true,
      }
    }

    onSelectField(fieldData)
    resetForm()
  }

  const resetForm = () => {
    setSelectedType(null)
    setFieldName("")
    setFieldDisplayName("")
    setIsRequired(false)
    setIsUnique(false)
    setRelatedContentType("")
  }

  const renderFieldConfig = () => {
    if (!selectedType) return null

    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${selectedType.color}`}
          >
            {React.createElement(selectedType.icon, { className: "w-4 h-4" })}
          </div>
          <div>
            <div className="font-medium">{selectedType.name}</div>
            <div className="text-sm text-gray-600">{selectedType.description}</div>
          </div>
        </div>

        <div>
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="e.g., firstName, email, productId"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The name must be unique and cannot contain special characters or spaces
          </p>
        </div>

        {selectedType.type === "relation" ? (
          <div>
            <Label htmlFor="relatedContentType">Related Content Type</Label>
            <Select value={relatedContentType} onValueChange={setRelatedContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((contentType) => (
                  <SelectItem key={contentType.id} value={contentType.id}>
                    {contentType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : selectedType.type !== "uid" ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="primary" checked={isPrimaryKey} onCheckedChange={(checked) => setIsPrimaryKey(!!checked)} />
              <Label htmlFor="unique">Primary field</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="required" disabled={isPrimaryKey} checked={isRequired} onCheckedChange={(checked) => setIsRequired(!!checked)} />
              <Label htmlFor="required">Required field</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="unique" disabled={isPrimaryKey} checked={isUnique} onCheckedChange={(checked) => setIsUnique(!!checked)} />
              <Label htmlFor="unique">Unique field</Label>
            </div>
          </div>
        ) : null}

        {selectedType.type === "relation" ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="oneToMany"
                checked={selectedRelation === "oneToMany"}
                onCheckedChange={() => handleCheckboxChange("oneToMany")}
              />
              <Label htmlFor="oneToMany">One To Many</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="manyToOne"
                checked={selectedRelation === "manyToOne"}
                onCheckedChange={() => handleCheckboxChange("manyToOne")}
              />
              <Label htmlFor="manyToOne">Many To One</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="manyToMany"
                checked={selectedRelation === "manyToMany"}
                onCheckedChange={() => handleCheckboxChange("manyToMany")}
              />
              <Label htmlFor="manyToMany">Many To Many</Label>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#4945ff] hover:bg-[#3730ff]"
            disabled={!fieldName || (selectedType.type === "relation" && !relatedContentType)}
          >
            Add Field
          </Button>
        </div>
      </div>
    )
  }

  const handleCheckboxChange = (type: string) => {
    if (selectedRelation === type) {
      setSelectedRelation(null); // uncheck if clicked again
    } else {
      setSelectedRelation(type);
    }
  };


  return (
    <div>
      {!selectedType ? (
        <div className="grid grid-cols-2 gap-3">
          {fieldTypes.map((field) => (
            <button
              key={field.type}
              onClick={() => handleTypeSelect(field.type)}
              className="flex items-start p-3 border border-gray-200 rounded-lg hover:border-[#4945ff] hover:bg-blue-50 transition-colors text-left"
            >
              <div className={`${field.color} p-2 rounded mr-3 flex-shrink-0`}>
                {React.createElement(field.icon, { className: "w-4 h-4 text-white" })}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{field.name}</h4>
                <p className="text-sm text-gray-500">{field.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        renderFieldConfig()
      )}
    </div>
  )
}
