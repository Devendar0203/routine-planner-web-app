import Link from "next/link"
import { Calendar, CheckSquare, LayoutGrid, TrendingUp, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Routine Planner</h1>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/daily" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Daily
            </Link>
            <Link href="/weekly" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Weekly
            </Link>
            <Link href="/stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Stats
            </Link>
            <Link href="/calendar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Calendar
            </Link>
            <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Archive
            </Link>
            <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-0">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight font-serif">
              Plan Your Day, <span className="text-primary">Own Your Time</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
              A beautiful and simple routine planner to help you organize your daily and weekly tasks. Stay productive,
              stay focused, and achieve your goals.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            <Link href="/daily" className="group">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <Calendar className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 font-serif">Daily Planner</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Organize your tasks for each day of the week
                </p>
              </div>
            </Link>

            <Link href="/weekly" className="group">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <LayoutGrid className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 font-serif">Weekly Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">See all your routines at a glance</p>
              </div>
            </Link>

            <Link href="/stats" className="group">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <TrendingUp className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 font-serif">Statistics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Track your progress and productivity</p>
              </div>
            </Link>

            <Link href="/calendar" className="group">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <Calendar className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 font-serif">Calendar View</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">See your tasks in a monthly calendar</p>
              </div>
            </Link>

            <Link href="/archive" className="group">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-200">
                <Archive className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 font-serif">Task Archive</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">View your completed task history</p>
              </div>
            </Link>

            <div className="bg-card border border-border rounded-lg p-6">
              <CheckSquare className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2 font-serif">Local Storage</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is saved automatically in your browser
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/daily" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow bg-[rgba(27,16,16,1)]">
                Start Planning Today
              </Button>
            </Link>
            <Link href="/weekly" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-secondary">
                View Weekly Overview
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and Tailwind CSS
        </div>
      </footer>
    </div>
  )
}
