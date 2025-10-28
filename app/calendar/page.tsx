"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { DayTasks } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPage() {
  const [tasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })

  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    let startDay = firstDay.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1

    const weeks: Array<Array<{ date: number | null; dayName: string | null }>> = []
    let currentWeek: Array<{ date: number | null; dayName: string | null }> = []

    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: null, dayName: null })
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const dayOfWeek = new Date(year, month, date).getDay()
      const dayName = DAYS[dayOfWeek === 0 ? 6 : dayOfWeek - 1]

      currentWeek.push({ date, dayName })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: null, dayName: null })
      }
      weeks.push(currentWeek)
    }

    return weeks
  }, [currentDate])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const today = new Date()
  const isToday = (date: number | null) => {
    if (!date) return false
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const getTasksForDay = (dayName: string | null) => {
    if (!dayName) return { total: 0, completed: 0 }
    const dayTasks = tasks[dayName] || []
    return {
      total: dayTasks.length,
      completed: dayTasks.filter((t) => t.completed).length,
    }
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
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Calendar View</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Month Navigation */}
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Calendar Grid */}
          <Card className="p-4 sm:p-6 shadow-sm">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day[0]}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="space-y-2">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => {
                    const taskStats = getTasksForDay(day.dayName)
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          aspect-square border rounded-lg p-2 flex flex-col items-center justify-center
                          ${day.date ? "bg-card hover:bg-muted/50 cursor-pointer" : "bg-transparent border-transparent"}
                          ${isToday(day.date) ? "border-primary border-2 bg-primary/5" : "border-border"}
                          transition-colors
                        `}
                      >
                        {day.date && (
                          <>
                            <span
                              className={`text-sm sm:text-base font-semibold mb-1 ${isToday(day.date) ? "text-primary" : ""}`}
                            >
                              {day.date}
                            </span>
                            {taskStats.total > 0 && (
                              <div className="flex flex-col items-center gap-0.5 w-full">
                                <div className="text-xs text-muted-foreground">
                                  {taskStats.completed}/{taskStats.total}
                                </div>
                                <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                                  <div
                                    className="bg-primary h-1 rounded-full transition-all"
                                    style={{
                                      width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Legend */}
          <Card className="p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary rounded bg-primary/5"></div>
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-border rounded bg-card"></div>
                <span className="text-muted-foreground">Has tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Task completion progress</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
