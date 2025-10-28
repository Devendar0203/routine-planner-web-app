export interface Routine {
  id: string
  title: string
  description?: string
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  time?: string
  completed: boolean
  createdAt: string
}

export interface Task {
  id: string
  text: string
  completed: boolean
  notes?: string
  createdAt: string
  completedAt?: string
}

export interface DayTasks {
  [key: string]: Task[]
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export const DAYS_OF_WEEK: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}
