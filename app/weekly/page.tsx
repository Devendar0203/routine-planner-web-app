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

export default function WeeklyPlannerPage() {
  const [tasks, setTasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [newTaskTexts, setNewTaskTexts] = useState<{ [key: string]: string }>({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  })
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesText, setNotesText] = useState("")

  const addTask = (day: string) => {
    if (newTaskTexts[day].trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskTexts[day],
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks({
      ...tasks,
      [day]: [...tasks[day], newTask],
    })
    setNewTaskTexts({
      ...newTaskTexts,
      [day]: "",
    })
  }

  const toggleTask = (day: string, taskId: string) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].map((task) =>
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

  const deleteTask = (day: string, taskId: string) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].filter((task) => task.id !== taskId),
    })
  }

  const saveNotes = (day: string, taskId: string) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].map((task) => (task.id === taskId ? { ...task, notes: notesText } : task)),
    })
    setEditingNotes(null)
    setNotesText("")
  }

  const openNotes = (task: Task) => {
    setEditingNotes(task.id)
    setNotesText(task.notes || "")
  }

  const getCompletionStats = (day: string) => {
    const dayTasks = tasks[day]
    const completed = dayTasks.filter((t) => t.completed).length
    const total = dayTasks.length
    return { completed, total }
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
              <CheckSquare className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Weekly Overview</h1>
            </div>
          </div>
          <Link href="/daily">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Daily View
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden bg-transparent">
              <CheckSquare className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS.map((day) => {
            const { completed, total } = getCompletionStats(day)
            return (
              <Card
                key={day}
                className="p-4 flex flex-col shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              >
                {/* Day Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-balance">{day}</h2>
                  {total > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {completed} / {total}
                        </span>
                        <span>{Math.round((completed / total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(completed / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Task Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add task..."
                    value={newTaskTexts[day]}
                    onChange={(e) =>
                      setNewTaskTexts({
                        ...newTaskTexts,
                        [day]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTask(day)
                    }}
                    className="flex-1 h-8 text-sm"
                  />
                  <Button onClick={() => addTask(day)} size="icon" className="h-8 w-8 flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-96">
                  {tasks[day].length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 leading-relaxed">No tasks</p>
                  ) : (
                    tasks[day].map((task) => (
                      <div key={task.id} className="p-2 rounded-md hover:bg-muted/50 group transition-colors">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(day, task.id)}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span
                              className={`block text-sm leading-relaxed transition-all ${
                                task.completed ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {task.text}
                            </span>
                            {editingNotes === task.id ? (
                              <div className="space-y-2 mt-2">
                                <Textarea
                                  placeholder="Add notes..."
                                  value={notesText}
                                  onChange={(e) => setNotesText(e.target.value)}
                                  className="min-h-[60px] resize-none text-xs"
                                />
                                <div className="flex gap-1">
                                  <Button size="sm" className="h-6 text-xs" onClick={() => saveNotes(day, task.id)}>
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-xs bg-transparent"
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
                                className="text-xs text-muted-foreground bg-secondary/50 p-1.5 rounded mt-1 cursor-pointer hover:bg-secondary/70 transition-colors"
                                onClick={() => openNotes(task)}
                              >
                                {task.notes}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openNotes(task)}
                              className={`h-6 w-6 flex-shrink-0 ${task.notes ? "text-primary" : ""}`}
                            >
                              <StickyNote className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(day, task.id)}
                              className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
