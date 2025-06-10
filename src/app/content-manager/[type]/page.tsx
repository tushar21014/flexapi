"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Search, Filter, Eye, Trash2, MoreHorizontal, Download, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmationModal } from "@/components/confirmation-modal"

interface Employee {
  id: string
  empId: string
  name: string
  salary: number
}



interface ContentTypePageProps {
  params: {
    type: string
  }
}

export default function ContentTypePage({ params }: ContentTypePageProps) {
  const searchParams = useSearchParams()
  const contentTypeDisplayName = searchParams.get("displayName") || "Content"

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<Employee | null>(null)
  const [fields, setFields] = useState<string[]>([])
  const [records, setRecords] = useState<any[]>([])

  const fetchSchemaFields = async (schemaId: string) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${process.env.NEXT_PUBLIC_SCHEMA_URL}/getSchema/${schemaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    console.log
    setFields(data)  // already a map like { empId: "string", name: "string", ... }
  }


  const fetchRecords = async (schemaId: string) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${process.env.NEXT_PUBLIC_RECORD_URL}/getRecord/${schemaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    console.log(data)
    setRecords(data)
  }

  // Mock data for employees

  // const filteredEmployees = employees.filter(
  //   (emp) =>
  //     emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.salary.toString().includes(searchTerm),
  // )

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEntry(employee)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would delete the entry here
    console.log("Deleting entry:", selectedEntry)
    setIsDeleteModalOpen(false)
    setSelectedEntry(null)
  }

  const handleViewEntry = (id: string) => {
    router.push(`/content-manager/${params.type}/${id}`)
  }

  // const contentTypeDisplayName = params.type.charAt(0).toUpperCase() + params.type.slice(1)

  useEffect(() => {
    fetchSchemaFields(params.type)
    fetchRecords(params.type)
  }, [])

  return (
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={`${contentTypeDisplayName} Entries`} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => router.push("/content-manager")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{contentTypeDisplayName}</h2>
                  {/* <p className="text-gray-600">{filteredEmployees.length} entries found</p> */}
                </div>
              </div>
              <Button className="bg-[#4945ff] hover:bg-[#3730ff]">
                <Plus className="w-4 h-4 mr-2" />
                Create new entry
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(fields).map((fieldName) => (
                      <TableHead key={fieldName}>
                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {records.map((record, index) => (
                    <TableRow key={record.id || index}>
                      {Object.keys(fields).map((fieldName) => (
                        <TableCell key={fieldName}>
          {record[fieldName] !== undefined ? record[fieldName] : "N/A"}
          </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEntry(record.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(record)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No entries found</p>
                </div>
              )} */}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        description={`Are you sure you want to delete ${selectedEntry?.name} (${selectedEntry?.empId})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
      />
    </div>
  )
}
