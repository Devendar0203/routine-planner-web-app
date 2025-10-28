"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Archive, Search, Calendar, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Task, DayTasks } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function ArchivePage() {
  const [tasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDay, setSelectedDay] = useState<string>("All")

  const completedTasks = useMemo(() => {
    const allCompleted: Array<Task & { day: string }> = []

    DAYS.forEach((day) => {
      const dayTasks = tasks[day].filter((task) => task.completed)
      dayTasks.forEach((task) => {
        allCompleted.push({ ...task, day })
      })
    })

    allCompleted.sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0
      return dateB - dateA
    })

    return allCompleted
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return completedTasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDay = selectedDay === "All" || task.day === selectedDay
      return matchesSearch && matchesDay
    })
  }, [completedTasks, searchQuery, selectedDay])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
              <Archive className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Task Archive</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Card */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{completedTasks.length}</h2>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Archive className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-4 shadow-sm">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search completed tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Day Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  variant={selectedDay === "All" ? "default" : "outline"}
                  onClick={() => setSelectedDay("All")}
                  size="sm"
                  className="flex-shrink-0"
                >
                  All Days
                </Button>
                {DAYS.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 3)}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card className="p-8 text-center shadow-sm">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground leading-relaxed">
                  {searchQuery || selectedDay !== "All"
                    ? "No completed tasks match your filters"
                    : "No completed tasks yet. Complete some tasks to see them here!"}
                </p>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="space-y-3">
                    {/* Task Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium leading-relaxed line-through text-muted-foreground">{task.text}</h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{task.day}</span>
                          </div>
                          <span>Completed: {formatDate(task.completedAt)}</span>
                        </div>
                      </div>
                      {task.notes && (
                        <div className="p-2 bg-primary/10 rounded">
                          <StickyNote className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Task Notes */}
                    {task.notes && (
                      <div className="bg-secondary/50 p-3 rounded text-sm text-muted-foreground leading-relaxed">
                        {task.notes}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Results Count */}
          {filteredTasks.length > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Showing {filteredTasks.length} of {completedTasks.length} completed tasks
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
