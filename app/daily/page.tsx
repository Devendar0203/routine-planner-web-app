"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckSquare, Plus, Trash2, ArrowLeft, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Task, DayTasks } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function DailyPlannerPage() {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [tasks, setTasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [newTaskText, setNewTaskText] = useState("")
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesText, setNotesText] = useState("")

  const addTask = () => {
    if (newTaskText.trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks({
      ...tasks,
      [selectedDay]: [...tasks[selectedDay], newTask],
    })
    setNewTaskText("")
  }

  const toggleTask = (taskId: string) => {
    setTasks({
      ...tasks,
      [selectedDay]: tasks[selectedDay].map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    })
  }

  const deleteTask = (taskId: string) => {
    setTasks({
      ...tasks,
      [selectedDay]: tasks[selectedDay].filter((task) => task.id !== taskId),
    })
  }

  const saveNotes = (taskId: string) => {
    setTasks({
      ...tasks,
      [selectedDay]: tasks[selectedDay].map((task) => (task.id === taskId ? { ...task, notes: notesText } : task)),
    })
    setEditingNotes(null)
    setNotesText("")
  }

  const openNotes = (task: Task) => {
    setEditingNotes(task.id)
    setNotesText(task.notes || "")
  }

  const currentTasks = tasks[selectedDay]
  const completedCount = currentTasks.filter((t) => t.completed).length
  const totalCount = currentTasks.length

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
              <CheckSquare className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Daily Planner</h1>
            </div>
          </div>
          <Link href="/weekly">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Weekly View
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden bg-transparent">
              <CheckSquare className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {DAYS.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className="flex-shrink-0 transition-all"
                size="sm"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </Button>
            ))}
          </div>

          {/* Progress Card */}
          <Card className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-balance">{selectedDay}</h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {completedCount} / {totalCount} completed
              </span>
            </div>
            {totalCount > 0 && (
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            )}
          </Card>

          {/* Add Task Input */}
          <Card className="p-4 shadow-sm">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask()
                }}
                className="flex-1"
              />
              <Button onClick={addTask} size="icon" className="flex-shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Tasks List */}
          <div className="space-y-2">
            {currentTasks.length === 0 ? (
              <Card className="p-8 text-center shadow-sm">
                <p className="text-muted-foreground leading-relaxed">No tasks yet. Add your first task above!</p>
              </Card>
            ) : (
              currentTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <span
                        className={`block leading-relaxed transition-all ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.text}
                      </span>
                      {editingNotes === task.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add notes..."
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveNotes(task.id)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingNotes(null)
                                setNotesText("")
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : task.notes ? (
                        <div
                          className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded cursor-pointer hover:bg-secondary/70 transition-colors"
                          onClick={() => openNotes(task)}
                        >
                          {task.notes}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openNotes(task)}
                        className={`flex-shrink-0 ${task.notes ? "text-primary" : ""}`}
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
