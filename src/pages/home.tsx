// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"


import data from "./data.json"
import { ModuleCards } from "@/components/module-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function Home() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <ModuleCards />
                {/* <SectionCards /> */}
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
            </div>
        </div>
    )
}
