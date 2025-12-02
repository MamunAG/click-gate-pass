/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  ChevronDown, 
  Search,
  X,
  type LucideIcon 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import helper functions from separate file
import { createSelectColumn, createActionsColumn, createDragColumn } from "./table-helpers"

//  TYPES 
export interface TableAction<TData = any> {
  label: string
  onClick: (row: TData) => void | Promise<void>
  icon?: LucideIcon
  variant?: "default" | "destructive"
  show?: (row: TData) => boolean
}

export interface BulkAction<TData = any> {
  label: string
  onClick: (selectedRows: TData[]) => void | Promise<void>
  icon?: LucideIcon
  variant?: "default" | "destructive"
}

export interface FilterConfig {
  columnId: string
  placeholder?: string
  type?: "text" | "search"
}

export interface AppDataTableProps<TData = any> {
  // Core Props
  data: TData[]
  columns: ColumnDef<TData>[]
  
  // Table Features
  enableSelection?: boolean
  enableSorting?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableColumnVisibility?: boolean
  enableDragAndDrop?: boolean
  
  // Actions
  rowActions?: TableAction<TData>[]
  bulkActions?: BulkAction<TData>[]
  
  // Filtering
  searchPlaceholder?: string
  columnFilters?: FilterConfig[]
  
  // Pagination
  pageSize?: number
  pageSizeOptions?: number[]
  showPaginationInfo?: boolean
  
  // Styling
  className?: string
  tableClassName?: string
  
  // Loading & Empty States
  isLoading?: boolean
  loadingText?: string
  emptyText?: string
  
  // Events
  onRowClick?: (row: TData) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  onDragEnd?: (oldIndex: number, newIndex: number, reorderedData: TData[]) => void
}

// ================== DRAGGABLE ROW COMPONENT ==================
interface DraggableRowProps<TData> {
  row: any
  onRowClick?: (row: TData) => void
}

function DraggableRow<TData>({ 
  row, 
  onRowClick 
}: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80",
        onRowClick && "cursor-pointer hover:bg-muted/50"
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      onClick={() => onRowClick?.(row.original)}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// ================== MAIN COMPONENT ==================
export function AppDataTable<TData>({
  data,
  columns: initialColumns,
  enableSelection = false,
  enableSorting = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableDragAndDrop = false,
  rowActions,
  bulkActions,
  searchPlaceholder = "Search...",
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPaginationInfo = true,
  className,
  tableClassName,
  isLoading = false,
  loadingText = "Loading...",
  emptyText = "No data available.",
  onRowClick,
  onSelectionChange,
  onDragEnd,
}: AppDataTableProps<TData>) {
  
  // ========== STATE ==========
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [tableData, setTableData] = React.useState(data)

  // ========== DRAG AND DROP SETUP ==========
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => {
    if (!enableDragAndDrop) return []
    return tableData?.map((item: any) => item.id) || []
  }, [tableData, enableDragAndDrop])

  // Update table data when external data changes
  React.useEffect(() => {
    setTableData(data)
  }, [data])

  // ========== ENHANCED COLUMNS ==========
  const columns = React.useMemo(() => {
    const cols = [...initialColumns]
    
    // Add selection column if enabled (must be first so drag is leftmost)
    if (enableSelection) {
      cols.unshift(createSelectColumn<TData>())
    }
    
    // Add drag column if enabled (added after selection so it appears on left)
    if (enableDragAndDrop) {
      cols.unshift(createDragColumn<TData>())
    }
    
    // Add actions column if actions are provided
    if (rowActions && rowActions.length > 0) {
      cols.push(createActionsColumn<TData>(rowActions))
    }
    
    return cols
  }, [initialColumns, enableSelection, enableDragAndDrop, rowActions])

  // ========== DRAG HANDLER ==========
  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      
      const reorderedData = arrayMove(tableData, oldIndex, newIndex)
      setTableData(reorderedData)
      
      // Call external handler if provided
      if (onDragEnd) {
        onDragEnd(oldIndex, newIndex, reorderedData)
      }
    }
  }, [dataIds, tableData, onDragEnd])

  // ========== TABLE INSTANCE ==========
  // Note: TanStack Table useReactTable returns functions that cannot be memoized safely
  // This is expected behavior and does not cause issues in practice
  const table = useReactTable({
    data: enableDragAndDrop ? tableData : data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // ========== EFFECTS ==========
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, onSelectionChange, table])

  // ========== COMPUTED VALUES ==========
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
  const hasSelectedRows = selectedRows.length > 0

  return (
    <div className={cn("w-full space-y-4", className)}>
      
      {/* ========== TOOLBAR ========== */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          
          {/* Global Search */}
          {enableGlobalFilter && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-8 max-w-sm"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          {bulkActions && hasSelectedRows && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedRows.length} selected
              </Badge>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "destructive" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Column Visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ========== TABLE ========== */}
      <div className="rounded-md border">
        {enableDragAndDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loadingText}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              enableDragAndDrop ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      onRowClick={onRowClick}
                    />
                  ))}
                </SortableContext>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
            </Table>
          </DndContext>
        ) : (
          <Table className={tableClassName}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {loadingText}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ========== PAGINATION ========== */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          
          {/* Selection Info */}
          {showPaginationInfo && (
            <div className="flex-1 text-sm text-muted-foreground">
              {enableSelection && (
                <>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </>
              )}
            </div>
          )}

          <div className="flex items-center space-x-6 lg:space-x-8">
            
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page Info */}
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                {"<<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                {"<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                {">"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
