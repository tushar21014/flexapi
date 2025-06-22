"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Users, FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast,{ Toaster } from "react-hot-toast"

export default function DashboardPage() {
  const [user, setUser] = useState({"email": "", "name": ""});
  const [schemaCount, setSchemaCount] = useState(0);
  useEffect(() => {
    // Fetch user data when the component mounts
    getUser()
    handleSchemaCount()
  }, [])

  const getUser = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      // Redirect to login if no token is found
      toast.error("You need to log in first")
      window.location.href = "/login"
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      const data = await response.json()
      setUser(data);

      console.log("User data:", data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Redirect to login on error
      window.location.href = "/login"
    }
  }

  const handleSchemaCount = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SCHEMA_URL}/schemasCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch content types")
      }
      const data = await response.json()
      setSchemaCount(data || 0)
      console.log("Content types count:", data)
      return data.length || 0
    } catch (error) {
      console.error("Error fetching content types:", error)
      return 0
    }
  }

  return (
    <>
    <Toaster/>
    <div className="flex h-screen bg-[#f6f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" username={user.name} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600">Here's what's happening with your content today.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Types</CardTitle>
                  <Database className="h-4 w-4 text-[#4945ff]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schemaCount}</div>
                  <p className="text-xs text-gray-600">Active schemas</p>
                  <Link href="/content-types">
                    <Button variant="outline" size="sm" className="mt-3">
                      View All
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entries</CardTitle>
                  <FileText className="h-4 w-4 text-[#4945ff]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-gray-600">Total entries</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Manage Content
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-[#4945ff]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-600">Active users</p>
                  <Link href="/users">
                    <Button variant="outline" size="sm" className="mt-3">
                      Manage Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New content type "Product" created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User "john@example.com" added</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Content type "Article" updated</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}
