/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { TableAction } from "./app-data-table"
import { DragHandle } from "./drag-handle"

// ================== COLUMN HELPER FUNCTIONS ==================

export function createDragColumn<TData = any>(): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={(row.original as any)?.id || row.id} />,
  }
}

export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }
}

export function createSortableColumn<TData>(
  accessor: keyof TData,
  header: string,
  cellRenderer?: (value: any) => React.ReactNode
): ColumnDef<TData> {
  return {
    accessorKey: accessor as string,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {header}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue(accessor as string)
      return cellRenderer ? cellRenderer(value) : <div>{String(value ?? '')}</div>
    },
  }
}

export function createActionsColumn<TData>(actions: TableAction<TData>[]): ColumnDef<TData> {
  return {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const visibleActions = actions.filter(action => 
        !action.show || action.show(row.original)
      )
      
      if (visibleActions.length === 0) return null
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                className={cn(
                  "cursor-pointer",
                  action.variant === "destructive" && 
                  "text-red-600 focus:bg-destructive focus:text-white"
                )}
                onClick={() => action.onClick(row.original)}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
  }
}