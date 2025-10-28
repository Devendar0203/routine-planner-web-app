import Link from "next/link"
import { CheckSquare } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <CheckSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Routine Planner</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/daily" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Daily
          </Link>
          <Link href="/weekly" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Weekly
          </Link>
        </nav>
      </div>
    </header>
  )
}
