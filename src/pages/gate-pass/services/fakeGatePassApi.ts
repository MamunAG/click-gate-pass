import { GatePassData } from "@/pages/gate-pass/index-page/gate-pass.data";
import type { IGatePassIndex } from "@/pages/gate-pass/index-page/gate-pass.dto";

export interface ApiResponse {
  data: IGatePassIndex[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// This simulates: GET /api/gate-pass?page=1&limit=5
export async function fetchGatePassData(page = 1, limit = 5): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Calculate pagination
  const total = GatePassData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = GatePassData.slice(startIndex, endIndex);
  
  console.log(`API Call: GET /gate-pass?page=${page}&limit=${limit} → ${data.length} records`);
  
  return {
    data,
    total,
    page,
    limit,
    totalPages
  };
}