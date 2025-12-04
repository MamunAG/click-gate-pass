import { GatePassTable } from "./index-page/gate-pass-table";
import GatePassIndexForm, {
  type formIndexType,
} from "./index-page/gate-pass-index-form";
// import { GatePassData } from "./index-page/gate-pass.data";
import React from "react";
import type { IGatePassIndex } from "./index-page/gate-pass.dto";
import { useNavigate } from "react-router-dom";
import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useAppStore } from "@/store/app-store";
import { fetchGatePassData } from "./services/fakeGatePassApi";

export default function GatePassIndex() {
  const [data, setData] = React.useState<IGatePassIndex[]>([]);
  const [filter, setFilter] = React.useState<formIndexType>({});
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchGatePassData(page, limit, filter);
        setData(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, filter]);

  const setPageTitle = useAppStore((state) => state.setPageName);
  React.useEffect(() => {
    setPageTitle("Gate-pass");
  }, [setPageTitle]);

  function handleIndexFormSubmit(filterParams: formIndexType) {
    setFilter(filterParams);
    setPage(1);
  }

  const navigator = useNavigate();
  return (
    <div className="p-3">
      <BreadcrumbAddNew
        addNewButtonText="Add New Gate-pass"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)}
      />
      <div>
        <GatePassIndexForm handleIndexFormSubmit={handleIndexFormSubmit} />
      </div>
      <div className="mt-5">
        <GatePassTable
          data={data}
          loading={loading}
          currentPage={page}
          pageSize={limit}
          totalCount={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>
    </div>
  );
}
