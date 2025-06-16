"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast';


interface Field {
  name: string
  displayName: string
  type: string
  required: boolean
  unique: boolean
  isPrimaryKey?: boolean
  maxLength?: number
  defaultValue?: any
  description?: string,
  relationSchema? : string

  constraints: {
    notNull: boolean
    unique: boolean
    primaryKey: boolean
    autoIncrement?: boolean
    maxLength?: number
    minLength?: number
    min?: number
    max?: number
  }
}

interface EntryFormProps {
  fields: Field[]
  initialData?: any
  onSave: (data: any) => Promise<void>;
  onEdit?: (id: string, data: any) => Promise<void>;
  onCancel: () => void
  isEditing?: boolean
  relationTableId?: string
}

export function EntryForm({ fields, initialData, onSave, onEdit, onCancel, isEditing = false, relationTableId }: EntryFormProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [relationalKeys, setRelationalKeys] = useState([])
  const isSubmittingRef = useRef(false);

  useEffect(() => {

    if( relationTableId != "") {
      if (relationTableId) {
        getRelationIds(relationTableId).then((keys) => setRelationalKeys(keys));
      }
    }
    if (initialData) {
      
      setFormData(initialData)
    } else {
      // Initialize with default values
      const defaultData: any = {}
      fields.forEach((field) => {
        if (field.name === "id") return  // Skip 'id' field entirely
  
        if (field.defaultValue !== undefined) {
          defaultData[field.name] = field.defaultValue
        } else {
          defaultData[field.name] = getDefaultValueForType(field.type)
        }
      })

      setFormData(defaultData)
    }
  }, [initialData, fields])
  

  const getRelationIds = async (id: String) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_SCHEMA_URL}/getPrimaryKeysData/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  
    const result = await data.json()
    console.log("Relation IDs:", result)
    return result 
  }
  

  const getDefaultValueForType = (type: string) => {
    switch (type) {
      case "number":
      case "integer":
        return 0
      case "boolean":
        return false
      case "date":
      case "datetime":
        return null
      case "json":
        return {}
      default:
        return ""
    }
  }

  const validateField = (field: Field, value: any): string | null => {
    // Required validation
    if (field.required && (value === "" || value === null || value === undefined)) {
      return `${field.displayName} is required`
    }

    // Type-specific validation
    switch (field.type) {
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address"
        }
        break        
      case "number":
      case "integer":
        if (value && isNaN(Number(value))) {
          return "Please enter a valid number"
        }
        if (field.constraints.min !== undefined && Number(value) < field.constraints.min) {
          return `Value must be at least ${field.constraints.min}`
        }
        if (field.constraints.max !== undefined && Number(value) > field.constraints.max) {
          return `Value must be at most ${field.constraints.max}`
        }
        break
      case "text":
      case "varchar":
      case "string":
        if (field.constraints.minLength && value.length < field.constraints.minLength) {
          return `Must be at least ${field.constraints.minLength} characters`
        }
        if (field.constraints.maxLength && value.length > field.constraints.maxLength) {
          return `Must be at most ${field.constraints.maxLength} characters`
        }
        break
    }

    return null
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }))
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        toast.error(error);
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
  
    try {
      if (initialData) {
        if (onEdit) await onEdit(initialData.id, formData);
      } else {
        await onSave(formData);
      }
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };
  

  const renderFieldInput = (field: Field) => {
    console.log("Rendering field:", formData)
    const value = formData[field.name]
    const hasError = !!errors[field.name]

    switch (field.type) {
      case "text":
      case "varchar":
      case "string":
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            maxLength={field.constraints.maxLength}
            className={hasError ? "border-red-500" : ""}

          />
        )

      case "email":
        return (
          <Input
            type="email"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            className={hasError ? "border-red-500" : ""}
          />
        )

      case "password":
        return (
          <Input
            type="password"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            className={hasError ? "border-red-500" : ""}
          />
        )

      case "number":
      case "integer":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value ? Number(e.target.value) : "")}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            min={field.constraints.min}
            max={field.constraints.max}
            className={hasError ? "border-red-500" : ""}
          />
        )

      case "richtext":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            rows={4}
            className={hasError ? "border-red-500" : ""}
          />
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox checked={value || false} onCheckedChange={(checked) => handleFieldChange(field.name, checked)} />
            <span className="text-sm">Yes</span>
          </div>
        )

      case "relation":
        return (
          <Select value={value || ""} onValueChange={(val: String) => handleFieldChange(field.name, val)}>
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${field.displayName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {relationalKeys.map((key: string) => {
                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                )
              })}
              {/* <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem> */}
            </SelectContent>
          </Select>
        )

      case "enumeration":
        return (
          <Select value={value || ""} onValueChange={(val: String) => handleFieldChange(field.name, val)}>
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${field.displayName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        )

      case "json":
        return (
          <Textarea
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || ""}
            onChange={(e) => {
              try {
                const jsonValue = JSON.parse(e.target.value)
                handleFieldChange(field.name, jsonValue)
              } catch {
                handleFieldChange(field.name, e.target.value)
              }
            }}
            placeholder="Enter valid JSON"
            rows={4}
            className={hasError ? "border-red-500" : ""}
          />
        )

      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.displayName.toLowerCase()}`}
            className={hasError ? "border-red-500" : ""}
          />
        )
    }
  }

  const getFieldTypeDisplay = (field: Field) => {
    const constraints = []

    if (field.constraints.primaryKey) constraints.push("PRIMARY KEY")
    if (field.constraints.notNull) constraints.push("NOT NULL")
    if (field.constraints.unique) constraints.push("UNIQUE")
    if (field.constraints.autoIncrement) constraints.push("AUTO INCREMENT")
    if (field.constraints.maxLength) constraints.push(`VARCHAR(${field.constraints.maxLength})`)

    return constraints.length > 0 ? constraints.join(", ") : field.type.toUpperCase()
  }

  return (
    <>
    <Toaster />
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Entry" : "Create New Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => {
            if (field.name === "id") return null;   // skip rendering this field

            return (
              <div key={field.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {field.displayName}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {getFieldTypeDisplay(field)}
                    </Badge>
                    {field.constraints.primaryKey && (
                      <Badge className="bg-blue-500 text-white text-xs">PK</Badge>
                    )}
                  </div>
                </div>

                {renderFieldInput(field)}

                {errors[field.name] && (
                  <p className="text-sm text-red-500">{errors[field.name]}</p>
                )}

                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            );
          })}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#4945ff] hover:bg-[#3730ff]">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : isEditing ? "Update Entry" : "Create Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}
