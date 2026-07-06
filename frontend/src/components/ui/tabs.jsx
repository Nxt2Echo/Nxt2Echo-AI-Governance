import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({})

function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const value = controlledValue ?? internalValue
  const setValue = (v) => {
    setInternalValue(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, value, children, ...props }) {
  const { value: activeValue, setValue } = React.useContext(TabsContext)
  const isActive = activeValue === value
  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ className, value, children, ...props }) {
  const { value: activeValue } = React.useContext(TabsContext)
  if (activeValue !== value) return null
  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      className={cn("mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
