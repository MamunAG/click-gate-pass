import { AppDataTable } from "@/components/app-data-table/app-data-table";
import type { IGatePassIndex } from "./gate-pass.dto";
import {
  gatePassColumns,
  gatePassActions,
  gatePassBulkActions,
} from "./gate-pass-table.config";

export function GatePassTable({ data }: { data: IGatePassIndex[] }) {
  return (
    <AppDataTable
      data={data}
      columns={gatePassColumns}
      enableSelection={true}
      enableSorting={true}
      enableGlobalFilter={true}
      enablePagination={true}
      enableColumnVisibility={true}
      enableDragAndDrop={true}
      rowActions={gatePassActions}
      bulkActions={gatePassBulkActions}
      searchPlaceholder="Search gate passes..."
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      enablePinning={false}
      pinnedColumnsCount={3}
    />
  );
}
