import { AppDataTable } from "@/components/app-data-table/app-data-table";
import type { IGatePassIndex } from "./gate-pass.dto";
import {
  gatePassColumns,
  gatePassActions,
  gatePassBulkActions,
} from "./gate-pass-table.config";

// ================== MAIN COMPONENT ==================
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
      onRowClick={(row) => {
        console.log("Clicked row:", row);
      }}
      onSelectionChange={(selectedRows) => {
        console.log("Selected:", selectedRows.length);
      }}
      onDragEnd={(oldIndex, newIndex, reorderedData) => {
        console.log(`Moved item from ${oldIndex} to ${newIndex}`);
        console.log("New order:", reorderedData);
      }}
    />
  );
}
