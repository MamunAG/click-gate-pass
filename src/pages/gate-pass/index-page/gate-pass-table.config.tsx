import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2, Copy, Download } from "lucide-react"
import { createSortableColumn } from "@/components/app-data-table/table-helpers"
import type { IGatePassIndex } from "./gate-pass.dto"
import { BulkAction, TableAction } from "@/components/app-data-table/types"

// Column Definitions
export const gatePassColumns: ColumnDef<IGatePassIndex>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  createSortableColumn<IGatePassIndex>("createdBy", "Created By"),
  {
    accessorKey: "refNo",
    header: "Ref No",
    cell: ({ row }) => <div>{row.getValue("refNo")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "orgSupplier",
    header: "Org Supplier",
    cell: ({ row }) => <div>{row.getValue("orgSupplier")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "aprvBy",
    header: "Aprv By",
    cell: ({ row }) => <div>{row.getValue("aprvBy")}</div>,
  },
]

// Action Definitions
export const gatePassActions: TableAction<IGatePassIndex>[] = [
  {
    label: "Copy Ref Number",
    icon: Copy,
    onClick: (row) => {
      navigator.clipboard.writeText(row.refNo)
      console.log("Reference number copied:", row.refNo)
    },
  },
  {
    label: "View Details",
    icon: Eye,
    onClick: (row) => {
      // Navigate to details page
      console.log("View details for:", row.id)
    },
  },
  {
    label: "Edit",
    icon: Edit,
    onClick: (row) => {
      // Navigate to edit page
      console.log("Edit gate pass:", row.id)
    },
  },
  {
    label: "Delete",
    icon: Trash2,
    variant: "destructive",
    onClick: async (row) => {
      if (confirm(`Are you sure you want to delete gate pass ${row.refNo}?`)) {
        try {
          // Call delete API
          console.log("Delete gate pass:", row.id)
        } catch (error) {
          console.error("Failed to delete gate pass:", error)
        }
      }
    },
    show: (row) => row.status !== "Approved", // Only show if not approved
  },
]

// Bulk Actions
export const gatePassBulkActions: BulkAction<IGatePassIndex>[] = [
  {
    label: "Export Selected",
    icon: Download,
    onClick: (selectedRows) => {
      // CSV Header
      const headers = ["Date", "Created By", "Ref No", "Type", "Org Supplier", "Status", "Approved By"]
      const headerRow = headers.join(",")
      
      // CSV Data Rows
      const dataRows = selectedRows
        .map(row => [
          `"${row.date}"`,
          `"${row.createdBy}"`,
          `"${row.refNo}"`,
          `"${row.type}"`,
          `"${row.orgSupplier}"`,
          `"${row.status}"`,
          `"${row.aprvBy}"`,
        ].join(","))
        .join("\n")
      
      const csv = `${headerRow}\n${dataRows}`
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `gate-pass-export-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      
      // Cleanup
      URL.revokeObjectURL(url)
      console.log(`Exported ${selectedRows.length} gate passes`)
    },
  },
]