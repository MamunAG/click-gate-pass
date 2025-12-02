import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"

interface DragHandleProps {
  id: string | number
}

export function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="sm"
      className="text-muted-foreground h-6 w-6 p-0 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="h-3 w-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}