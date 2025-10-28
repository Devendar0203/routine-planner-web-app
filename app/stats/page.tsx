"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Target, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { DayTasks } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function StatsPage() {
  const [tasks] = useLocalStorage<DayTasks>("daily-planner-tasks", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })

  const stats = useMemo(() => {
    let totalTasks = 0
    let completedTasks = 0
    let tasksWithNotes = 0
    const dailyStats: { day: string; total: number; completed: number; percentage: number }[] = []

    DAYS.forEach((day) => {
      const dayTasks = tasks[day]
      const completed = dayTasks.filter((t) => t.completed).length
      const total = dayTasks.length
      const withNotes = dayTasks.filter((t) => t.notes).length

      totalTasks += total
      completedTasks += completed
      tasksWithNotes += withNotes

      dailyStats.push({
        day,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      })
    })

    const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const bestDay = dailyStats.reduce((best, current) => {
      if (current.total === 0) return best
      return current.percentage > best.percentage ? current : best
    }, dailyStats[0])

    const activeDays = dailyStats.filter((d) => d.total > 0).length

    return {
      totalTasks,
      completedTasks,
      tasksWithNotes,
      overallPercentage,
      dailyStats,
      bestDay,
      activeDays,
    }
  }, [tasks])

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
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Statistics</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{stats.totalTasks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Days</p>
                  <p className="text-2xl font-bold">{stats.activeDays}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{stats.overallPercentage}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Best Day Card */}
          {stats.bestDay.total > 0 && (
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Performing Day</p>
                  <p className="text-2xl font-bold">{stats.bestDay.day}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.bestDay.completed} of {stats.bestDay.total} tasks completed ({stats.bestDay.percentage}%)
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Daily Breakdown */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Daily Breakdown</h2>
            <div className="space-y-4">
              {stats.dailyStats.map((dayStat) => (
                <div key={dayStat.day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dayStat.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {dayStat.completed} / {dayStat.total} ({dayStat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${dayStat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Tasks with Notes</h3>
              <p className="text-3xl font-bold text-primary">{stats.tasksWithNotes}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.totalTasks > 0
                  ? `${Math.round((stats.tasksWithNotes / stats.totalTasks) * 100)}% of all tasks`
                  : "No tasks yet"}
              </p>
            </Card>

            <Card className="p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Pending Tasks</h3>
              <p className="text-3xl font-bold text-orange-500">{stats.totalTasks - stats.completedTasks}</p>
              <p className="text-sm text-muted-foreground mt-1">Tasks remaining to complete</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
