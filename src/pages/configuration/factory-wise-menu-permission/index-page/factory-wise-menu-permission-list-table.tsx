/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef, type ColumnFiltersState, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { ArrowUpDown, PenBoxIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { useState } from "react"


// Type
export type IFactoryPermission = {
    companyId: number
    companyName: string
    noOfModule: string
    noOfMenu: string
    createdBy: string | null
    updatedBy: string | null
}

// Columns
export const FactoryPermissionColumns: ColumnDef<IFactoryPermission>[] = [
    {
        accessorKey: "companyName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Factory Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("companyName")}</div>,
    },

    {
        accessorKey: "noOfModule",
        header: "No of Module",
        cell: ({ row }) => <div className="text-center">{row.getValue("noOfModule")}</div>,
    },

    {
        accessorKey: "noOfMenu",
        header: "No of Menu",
        cell: ({ row }) => <div className="text-center">{row.getValue("noOfMenu")}</div>,
    },

    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("createdBy") ?? "-"}</div>
        ),
    },

    {
        accessorKey: "updatedBy",
        header: "Updated By",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("updatedBy") ?? "-"}</div>
        ),
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const record = row.original;

            return (
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => console.log("Edit clicked:", record.companyId)}
                >
                    <PenBoxIcon className="h-4 w-4" />
                </Button>
            );
        },
    },
]



// Table
export function FactoryWiseMenuPermissionIndexTable({
    data,
}: {
    data: IFactoryPermission[]
}) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns: FactoryPermissionColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full">

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center p-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={FactoryPermissionColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>


        </div>
    )
}
