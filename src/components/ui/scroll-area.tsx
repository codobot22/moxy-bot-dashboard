"use client"
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.ScrollAreaScrollbar orientation="vertical" className="flex h-full w-2.5 touch-none select-none p-0.5">
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = "ScrollArea"
export { ScrollArea }
