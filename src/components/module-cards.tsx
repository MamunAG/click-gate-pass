
import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { ReactNode } from "react";
import { ModuleIcons } from "./module-icon";


function ModuleCard({ children }: { children: ReactNode | ReactNode[]; }) {
    return (
        <Card className="hover:cursor-pointer p-5">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl flex items-center gap-3">
                {children}
            </CardTitle>
        </Card>
    )
}

export function ModuleCards() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-5">
            <ModuleCard>
                <ModuleIcons.MasterSettings />
                <span>Master Settings</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Merchandising />
                <span>Merchandising</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Planning />
                <span>Planning</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Procurement />
                <span>Procurement</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Payroll />
                <span>Payroll</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.GMTProduction />
                <span>GMT Production</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Inventory />
                <span>Inventory</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Textile />
                <span>Textile</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.IE />
                <span>IE</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Quality />
                <span>Quality</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Commercial />
                <span>Commercial</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Accounting />
                <span>Accounting</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.Logistic />
                <span>Logistic</span>
            </ModuleCard>
            <ModuleCard>
                <ModuleIcons.PrintEmbroidery />
                <span>Print $ Embroidery</span>
            </ModuleCard>
        </div>
    )
}
