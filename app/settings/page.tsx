"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Upload, Settings, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { DayTasks } from "@/lib/types"

export default function SettingsPage() {
  const [tasks, setTasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `routine-planner-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        if (typeof importedData === "object" && importedData !== null) {
          setTasks(importedData)
          setMessage({ type: "success", text: "Data imported successfully!" })
          setTimeout(() => setMessage(null), 3000)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to import data. Invalid file format." })
        setTimeout(() => setMessage(null), 3000)
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
      setTasks({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      })
      setMessage({ type: "success", text: "All data cleared successfully!" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const totalTasks = Object.values(tasks).reduce((sum, dayTasks) => sum + dayTasks.length, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Message Banner */}
          {message && (
            <Card
              className={`p-4 shadow-sm animate-in fade-in slide-in-from-top-2 ${
                message.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className={`h-5 w-5 ${message.type === "success" ? "text-green-500" : "text-red-500"}`} />
                <p className={message.type === "success" ? "text-green-500" : "text-red-500"}>{message.text}</p>
              </div>
            </Card>
          )}

          {/* Data Overview */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Total tasks stored: {totalTasks}</p>
              <p className="text-sm">Your data is stored locally in your browser</p>
            </div>
          </Card>

          {/* Export Data */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Download all your tasks as a JSON file. You can use this to backup your data or transfer it to another
                  device.
                </p>
                <Button onClick={exportData} className="shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Tasks
                </Button>
              </div>
            </div>
          </Card>

          {/* Import Data */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Upload a previously exported JSON file to restore your tasks. This will replace your current data.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="shadow-sm bg-transparent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Tasks
                </Button>
              </div>
            </div>
          </Card>

          {/* Clear Data */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-destructive">Clear All Data</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Permanently delete all your tasks. This action cannot be undone. Make sure to export your data first
                  if you want to keep a backup.
                </p>
                <Button onClick={clearAllData} variant="destructive" className="shadow-sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Tasks
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
