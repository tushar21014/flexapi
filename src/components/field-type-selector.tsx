"use client"

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
}

export function FieldTypeSelector({ onSelectField }: FieldTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {fieldTypes.map((field) => {
        const Icon = field.icon
        return (
          <button
            key={field.type}
            onClick={() => onSelectField(field)}
            className="flex items-start p-3 border border-gray-200 rounded-lg hover:border-[#4945ff] hover:bg-blue-50 transition-colors text-left"
          >
            <div className={`${field.color} p-2 rounded mr-3 flex-shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">{field.name}</h4>
              <p className="text-sm text-gray-500">{field.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
