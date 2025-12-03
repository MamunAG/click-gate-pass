import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export type IFactoryRow = {
    companyId: number
    companyName: string
    companyTypeId: number
    companyUnitType: string
    isActive: boolean
}

export default function FactoryPermissionTable({
    rows,
    setRows,
}: {
    rows: IFactoryRow[]
    setRows: React.Dispatch<React.SetStateAction<IFactoryRow[]>>
}) {

    // compute checkAll dynamically
    const checkAll = rows.length > 0 && rows.every(r => r.isActive)

    const handleCheckAllChange = (value: boolean) => {
        const updated = rows.map(r => ({ ...r, isActive: value }))
        setRows(updated)
    }

    return (
        <div>
            <div className="flex items-center float-end mt-2 mb-2 gap-2">
                <Checkbox
                    checked={checkAll}
                    onCheckedChange={(value) => handleCheckAllChange(!!value)}
                />
                <span>Check All</span>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Factory Name</TableHead>
                        <TableHead>Company Unit Type</TableHead>
                        <TableHead>Active</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No rows yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.companyName}</TableCell>
                                <TableCell>{row.companyUnitType}</TableCell>
                                <TableCell className="flex justify-start">
                                    <Checkbox
                                        checked={row.isActive}
                                        onCheckedChange={(checked) => {
                                            const updated = [...rows]
                                            updated[index].isActive = !!checked
                                            setRows(updated)
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
