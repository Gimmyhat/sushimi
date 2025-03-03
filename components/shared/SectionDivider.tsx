import { cn } from "@/lib/utils"

interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export default function SectionDivider({ className, ...props }: SectionDividerProps) {
  return (
    <div 
      className={cn(
        "h-16 md:h-24 w-full bg-gradient-to-b from-transparent to-background", 
        className
      )} 
      {...props} 
    />
  )
} 