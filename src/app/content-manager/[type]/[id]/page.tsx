"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { ConfirmationModal } from "@/components/confirmation-modal"

interface EntryDetailPageProps {
  params: {
    type: string
    id: string
  }
}

export default function EntryDetailPage({ params }: EntryDetailPageProps) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Mock data for the employee
  const [entry, setEntry] = useState({
    id: params.id,
    empId: params.id === "1" ? "E001" : params.id === "2" ? "E002" : `E00${params.id}`,
    name: params.id === "1" ? "Tushar" : params.id === "2" ? "Shivam" : "Employee",
    salary: params.id === "1" ? 50000 : params.id === "2" ? 45000 : 40000,
  })

  const handleInputChange = (field: string, value: string | number) => {
    setEntry((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, you would save the changes here
    console.log("Saving entry:", entry)
    router.push(`/content-manager/${params.type}`)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would delete the entry here
    console.log("Deleting entry:", entry)
    setIsDeleteModalOpen(false)
    router.push(`/content-manager/${params.type}`)
  }

  const contentTypeDisplayName = params.type.charAt(0).toUpperCase() + params.type.slice(1)

  return (
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={`Edit ${contentTypeDisplayName}`} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => router.push(`/content-manager/${params.type}`)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {entry.name} ({entry.empId})
                </h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button onClick={handleSave} className="bg-[#4945ff] hover:bg-[#3730ff]">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <Input
                    value={entry.empId}
                    onChange={(e) => handleInputChange("empId", e.target.value)}
                    placeholder="Employee ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={entry.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Employee Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <Input
                    type="number"
                    value={entry.salary}
                    onChange={(e) => handleInputChange("salary", Number.parseInt(e.target.value, 10) || 0)}
                    placeholder="Salary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        description={`Are you sure you want to delete ${entry.name} (${entry.empId})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
      />
    </div>
  )
}
