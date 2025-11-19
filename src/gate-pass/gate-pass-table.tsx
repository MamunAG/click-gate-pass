/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const data: IGatePassIndex[] = [
    {
        id: "1",
        sl: 1,
        date: "18-NOV-2025",
        createdBy: "Md. Nasir Uddin",
        refNo: "GP25110010778",
        type: "Garments",
        orgSupplier: "Aretex",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 2,
        date: "18-NOV-2025",
        createdBy: "Md. Nasir Uddin",
        refNo: "GP25110010777",
        type: "Garments",
        orgSupplier: "SGS Bangladesh Ltd",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 3,
        date: "18-NOV-2025",
        createdBy: "Abu jafor",
        refNo: "GP25110010776",
        type: "Garments",
        orgSupplier: "POETICGEM INTERNATIONAL LTD.",
        status: "Approved",
        aprvBy: "Zakir"
    },
    {
        id: "1",
        sl: 4,
        date: "18-NOV-2025",
        createdBy: "Md. Parves Prantik",
        refNo: "GP25110010775",
        type: "Garments",
        orgSupplier: "Fashion hub",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 5,
        date: "18-NOV-2025",
        createdBy: "Jobaer Ahmed",
        refNo: "GP25110010774",
        type: "Garments",
        orgSupplier: "Poeticgem International FZCO",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 6,
        date: "18-NOV-2025",
        createdBy: "Rabeya Akter",
        refNo: "GP25110010773",
        type: "Garments",
        orgSupplier: "GOODEARTH APPARELS LIMITED",
        status: "Approved",
        aprvBy: "Zakir"
    },
    {
        id: "1",
        sl: 7,
        date: "18-NOV-2025",
        createdBy: "Jobaer Ahmed",
        refNo: "GP25110010772",
        type: "Garments",
        orgSupplier: "Poeticgem International FZCO",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 8,
        date: "18-NOV-2025",
        createdBy: "Md. Laium Hossen",
        refNo: "GP25110010771",
        type: "Garments",
        orgSupplier: "SILK INTERNATIONAL LTD. (DYEING)",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 9,
        date: "18-NOV-2025",
        createdBy: "Abu jafor",
        refNo: "GP25110010770",
        type: "Garments",
        orgSupplier: "POETICGEM INTERNATIONAL LTD.",
        status: "Approved",
        aprvBy: "Moni"
    },
    {
        id: "1",
        sl: 10,
        date: "18-NOV-2025",
        createdBy: "Abu jafor",
        refNo: "GP25110010769",
        type: "Garments",
        orgSupplier: "FYNCH HATTON TEXTILHANDELSGES. GMBH",
        status: "Approved",
        aprvBy: "Moni"
    }

]

export type IGatePassIndex = {
    id: string,
    sl: number,
    date: string,
    createdBy: string,
    refNo: string,
    type: string,
    orgSupplier: string,
    status: string,
    aprvBy: string,
}

export const columns: ColumnDef<IGatePassIndex>[] = [
    {
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
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div >{row.getValue("date")}</div>
        ),
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created By
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("createdBy")}</div>,
    },
    {
        accessorKey: "refNo",
        header: "Ref No",
        cell: ({ row }) => (
            <div >{row.getValue("refNo")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <div >{row.getValue("type")}</div>
        ),
    },
    {
        accessorKey: "orgSupplier",
        header: "Org Supplier",
        cell: ({ row }) => (
            <div >{row.getValue("orgSupplier")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div >{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "aprvBy",
        header: "Aprv By",
        cell: ({ row }) => (
            <div >{row.getValue("aprvBy")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy Gate-pass Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:bg-destructive focus:text-white">Delete</DropdownMenuItem>
                        <DropdownMenuItem>Show</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function GatePassTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 hidden">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}

                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value: any) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
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
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
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
        </div>
    )
}
