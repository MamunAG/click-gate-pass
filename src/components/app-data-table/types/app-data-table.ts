/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import type { TableAction, BulkAction } from "./actions";
import type { FilterConfig } from "./filter";

export interface AppDataTableProps<TData = any> {
  // Core Props
  data: TData[];
  columns: ColumnDef<TData>[];

  // Table Features
  enableSelection?: boolean;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableDragAndDrop?: boolean;

  // Actions
  rowActions?: TableAction<TData>[];
  bulkActions?: BulkAction<TData>[];

  // Filtering
  searchPlaceholder?: string;
  columnFilters?: FilterConfig[];

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
  showPaginationInfo?: boolean;

  // Styling
  className?: string;
  tableClassName?: string;

  // Loading & Empty States
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
}
