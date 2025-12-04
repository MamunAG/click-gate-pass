import { AppDataTable } from "@/components/app-data-table/app-data-table";
import type { IGatePassIndex } from "./gate-pass.dto";
import {
  gatePassColumns,
  gatePassActions,
  gatePassBulkActions,
} from "./gate-pass-table.config";

interface GatePassTableProps {
  data: IGatePassIndex[];
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

export function GatePassTable({
  data,
  loading,
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: GatePassTableProps) {
  return (
    <AppDataTable
      data={data}
      columns={gatePassColumns}
      rowActions={gatePassActions}
      bulkActions={gatePassBulkActions}
      enableSelection={true}
      enableSorting={true}
      enableGlobalFilter={true}
      searchPlaceholder="Search gate passes..."
      enableColumnVisibility={true}
      enableDragAndDrop={true}
      enablePagination={true}
      pageSize={pageSize}
      pageSizeOptions={[2, 10, 20, 50]}
      enablePinning={true}
      pinnedColumnsCount={4}
      isLoading={loading}
      serverPagination={{
        currentPage,
        pageSize,
        totalCount,
        totalPages,
        onPageChange,
        onPageSizeChange
      }}
    />
  );
}
