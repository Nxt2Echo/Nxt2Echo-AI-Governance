import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({})

function Select({ children, value: controlledValue, onValueChange, defaultValue }) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const value = controlledValue ?? internalValue
  const ref = React.useRef(null)

  const setValue = (v) => {
    setInternalValue(v)
    onValueChange?.(v)
    setOpen(false)
  }

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, placeholder, ...props }) {
  const { open, setOpen, value } = React.useContext(SelectContext)
  return (
    <button
      data-slot="select-trigger"
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || placeholder || "Select..."}</span>}
      <svg className="h-4 w-4 opacity-50 ml-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div
      data-slot="select-content"
      className={cn(
        "absolute z-50 top-full mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectItem({ className, value, children, ...props }) {
  const { setValue, value: selectedValue } = React.useContext(SelectContext)
  const isSelected = selectedValue === value
  return (
    <div
      data-slot="select-item"
      onClick={() => setValue(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

function SelectGroup({ children, ...props }) {
  return <div {...props}>{children}</div>
}

function SelectLabel({ className, children, ...props }) {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props}>
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel }
