/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  type ColumnFiltersState,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  createSelectColumn,
  createActionsColumn,
  createDragColumn,
} from "./table-helpers";
import { DraggableRow } from "./draggable-row";
import { useState } from "react";
import { AppDataTableProps } from "./types";
import { usePinningStyles } from "./pinned-column";

export function AppDataTable<TData>({
  data,
  columns: initialColumns,
  enableSelection = false,
  enableSorting = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableDragAndDrop = false,
  enablePinning = false,
  pinnedColumnsCount = 3,
  rowActions,
  bulkActions,
  searchPlaceholder = "Search...",
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPaginationInfo = true,
  serverPagination,
  className,
  tableClassName,
  isLoading = false,
  loadingText = "Loading...",
  emptyText = "No data available.",
}: AppDataTableProps<TData>) {
  //  State setup
  const { getCommonPinningStyles } = usePinningStyles();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [tableData, setTableData] = useState(data);

  // Sync tableData when data prop changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Drag & Drop Setup
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Columns Setup
  const columns = React.useMemo(() => {
    const cols = [...initialColumns];

    if (enableSelection) {
      cols.unshift(createSelectColumn<TData>());
    }

    if (enableDragAndDrop) {
      cols.unshift(createDragColumn<TData>());
    }

    if (rowActions && rowActions.length > 0) {
      cols.push(createActionsColumn<TData>(rowActions));
    }

    return cols;
  }, [initialColumns, enableSelection, enableDragAndDrop, rowActions]);

  // Auto-pin columns when enablePinning is true
  React.useEffect(() => {
    if (enablePinning && columns.length > 0) {
      const columnIds = columns
        .slice(0, pinnedColumnsCount)
        .map((col, index) => {
          // Get the column id properly
          if (typeof col.id === "string") {
            return col.id;
          } else if ("accessorKey" in col && col.accessorKey) {
            return String(col.accessorKey);
          } else {
            return `column-${index}`;
          }
        });

      setColumnPinning({
        left: columnIds,
      });
    } else {
      setColumnPinning({});
    }
  }, [enablePinning, pinnedColumnsCount, columns]);

  // Table Instance
  const table = useReactTable({
    data: enableDragAndDrop ? tableData : data,
    columns,
    getRowId: (row) => (row as any).id?.toString() || Math.random().toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !serverPagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    enableColumnPinning: enablePinning,
    manualPagination: serverPagination ? true : false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning,
    },
    initialState: {
      pagination: {
        pageSize: serverPagination ? serverPagination.pageSize : pageSize,
      },
    },
  });
  
  console.log("Pagination:", serverPagination);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => {
    if (!enableDragAndDrop) return [];
    return tableData?.map((item: any) => item.id) || [];
  }, [tableData, enableDragAndDrop]);

  // Drag Handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Computed Values
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const hasSelectedRows = selectedRows.length > 0;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar */}
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
              <Badge variant="secondary">{selectedRows.length} selected</Badge>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={
                    action.variant === "destructive" ? "destructive" : "outline"
                  }
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {enableDragAndDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ ...getCommonPinningStyles(column) }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {loadingText}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn("cursor-pointer hover:bg-muted/50")}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      return (
                        <TableCell
                          key={cell.id}
                          style={{ ...getCommonPinningStyles(column) }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          {/* Selection Info */}
          {showPaginationInfo && (
            <div className="flex-1 text-sm text-muted-foreground">
              {serverPagination ? (
                <>
                  Showing{" "}
                  {(serverPagination.currentPage - 1) *
                    serverPagination.pageSize +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    serverPagination.currentPage * serverPagination.pageSize,
                    serverPagination.totalCount
                  )}{" "}
                  of {serverPagination.totalCount} entries
                  {enableSelection &&
                    table.getFilteredSelectedRowModel().rows.length > 0 && (
                      <>
                        {" "}
                        ({table.getFilteredSelectedRowModel().rows.length}{" "}
                        selected)
                      </>
                    )}
                </>
              ) : (
                enableSelection && (
                  <>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </>
                )
              )}
            </div>
          )}

          <div className="flex items-center space-x-6 lg:space-x-8">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${
                  serverPagination
                    ? serverPagination.pageSize
                    : table.getState().pagination.pageSize
                }`}
                onValueChange={(value) => {
                  if (serverPagination) {
                    serverPagination.onPageSizeChange(Number(value));
                  } else {
                    table.setPageSize(Number(value));
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={
                      serverPagination
                        ? serverPagination.pageSize
                        : table.getState().pagination.pageSize
                    }
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page Info */}
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {serverPagination
                ? serverPagination.totalPages === 0
                  ? "No pages"
                  : `Page ${serverPagination.currentPage} of ${serverPagination.totalPages}`
                : table.getPageCount() === 0
                ? "No pages"
                : `Page ${
                    table.getState().pagination.pageIndex + 1
                  } of ${table.getPageCount()}`}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (serverPagination) {
                    serverPagination.onPageChange(1);
                  } else {
                    table.setPageIndex(0);
                  }
                }}
                disabled={
                  serverPagination
                    ? serverPagination.currentPage === 1
                    : !table.getCanPreviousPage()
                }
              >
                <span className="sr-only">Go to first page</span>
                {"<<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (serverPagination) {
                    serverPagination.onPageChange(
                      serverPagination.currentPage - 1
                    );
                  } else {
                    table.previousPage();
                  }
                }}
                disabled={
                  serverPagination
                    ? serverPagination.currentPage === 1
                    : !table.getCanPreviousPage()
                }
              >
                <span className="sr-only">Go to previous page</span>
                {"<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (serverPagination) {
                    serverPagination.onPageChange(
                      serverPagination.currentPage + 1
                    );
                  } else {
                    table.nextPage();
                  }
                }}
                disabled={
                  serverPagination
                    ? serverPagination.currentPage ===
                      serverPagination.totalPages
                    : !table.getCanNextPage()
                }
              >
                <span className="sr-only">Go to next page</span>
                {">"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (serverPagination) {
                    serverPagination.onPageChange(serverPagination.totalPages);
                  } else {
                    table.setPageIndex(table.getPageCount() - 1);
                  }
                }}
                disabled={
                  serverPagination
                    ? serverPagination.currentPage ===
                      serverPagination.totalPages
                    : !table.getCanNextPage()
                }
              >
                <span className="sr-only">Go to last page</span>
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
