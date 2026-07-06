import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/15 text-destructive border-destructive/20",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
        warning: "border-transparent bg-amber-500/15 text-amber-400 border-amber-500/20",
        info: "border-transparent bg-blue-500/15 text-blue-400 border-blue-500/20",
        purple: "border-transparent bg-purple-500/15 text-purple-400 border-purple-500/20",
        critical: "border-transparent bg-red-500/20 text-red-400 border-red-500/30 font-bold",
        high: "border-transparent bg-orange-500/15 text-orange-400 border-orange-500/20",
        medium: "border-transparent bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
        low: "border-transparent bg-green-500/15 text-green-400 border-green-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
