"use client"

import { ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ title, username }: { title: string, username?: string }) {
  return (
    <header className="bg-white border-b border-[#dcdce4] px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{username}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
