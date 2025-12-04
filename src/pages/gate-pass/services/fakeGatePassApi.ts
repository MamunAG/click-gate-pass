import { GatePassData } from "@/pages/gate-pass/index-page/gate-pass.data";
import type { IGatePassIndex } from "@/pages/gate-pass/index-page/gate-pass.dto";
import { formIndexType } from "../index-page/gate-pass-index-form";

export interface ApiResponse {
  data: IGatePassIndex[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// This simulates: GET /api/gate-pass?page=1&limit=5
export async function fetchGatePassData(
  page = 1,
  limit = 5,
  filters: formIndexType
): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // STEP 1: Apply filters FIRST (on ALL data)
  let filteredData = [...GatePassData];

  if (filters.createdBy) {
    filteredData = filteredData.filter((item) =>
      item.createdBy.includes(filters.createdBy!)
    );
  }
  if (filters.fromDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.date) >= filters.fromDate!
    );
  }
  if (filters.toDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.date) <= filters.toDate!
    );
  }

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = filteredData.slice(startIndex, endIndex);

  console.log(
    `API Call: GET /gate-pass?page=${page}&limit=${limit} → ${data.length} records`
  );
  console.log("API Call ", data);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
