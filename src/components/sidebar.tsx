"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, Users, Settings, Puzzle, ImageIcon, Home, FileText, Sparkles, Brain } from "lucide-react"

// Update the navigation array to include Content Manager
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Schema Manager", href: "/content-manager", icon: FileText },
  { name: "Schema Types", href: "/content-types", icon: Database },
  { name: "Users", href: "/users", icon: Users },
]

// New AI section
const aiTools = [
  { name: "AI Schema Generator", href: "/ai/schema-generator", icon: Brain },
  { name: "AI Content Assistant", href: "/ai/content-assistant", icon: Sparkles },
]

const plugins = [
  { name: "Schema Builder", href: "/content-types/builder", icon: Database },
  { name: "Media Library", href: "/media", icon: ImageIcon },
]

const general = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Plugins", href: "/plugins", icon: Puzzle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#212134] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#4945ff] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg">FlexiApi</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Collection Types */}
        <div className="p-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Collection Types</h3>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive ? "bg-[#4945ff] text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">AI Tools</h3>
          <nav className="space-y-1">
            {aiTools.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 ${!isActive && "group-hover:text-purple-400"}`} />
                  {item.name}
                  {!isActive && (
                    <div className="ml-auto">
                      <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Plugins */}
        <div className="p-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Plugins</h3>
          <nav className="space-y-1">
            {plugins.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive ? "bg-[#4945ff] text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* General */}
        <div className="p-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">General</h3>
          <nav className="space-y-1">
            {general.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive ? "bg-[#4945ff] text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
