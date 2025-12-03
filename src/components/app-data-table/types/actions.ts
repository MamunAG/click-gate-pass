/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";

export interface TableAction<TData = any> {
  label: string;
  onClick: (row: TData) => void | Promise<void>;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
  show?: (row: TData) => boolean;
}

export interface BulkAction<TData = any> {
  label: string;
  onClick: (selectedRows: TData[]) => void | Promise<void>;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}
