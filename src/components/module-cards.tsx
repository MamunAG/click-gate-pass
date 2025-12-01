
import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { BadgeDollarSign, BriefcaseBusiness, ChartGantt, Container, Factory, Forklift, HandCoins, Settings, ShieldCheck, Ship, SquareActivity, SquareChartGantt, Stamp, SwatchBook } from "lucide-react"
import { ReactNode } from "react";

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
                <Settings />
                <span>Master Settings</span>
            </ModuleCard>
            <ModuleCard>
                <BriefcaseBusiness />
                <span>Merchandising</span>
            </ModuleCard>
            <ModuleCard>
                <ChartGantt />
                <span>Planning</span>
            </ModuleCard>
            <ModuleCard>
                <SquareChartGantt />
                <span>Procurement</span>
            </ModuleCard>
            <ModuleCard>
                <HandCoins />
                <span>Payroll</span>
            </ModuleCard>
            <ModuleCard>
                <Factory />
                <span>GMT Production</span>
            </ModuleCard>
            <ModuleCard>
                <Container />
                <span>Inventory</span>
            </ModuleCard>
            <ModuleCard>
                <SwatchBook />
                <span>Textile</span>
            </ModuleCard>
            <ModuleCard>
                <SquareActivity />
                <span>IE</span>
            </ModuleCard>
            <ModuleCard>
                <ShieldCheck />
                <span>Quality</span>
            </ModuleCard>
            <ModuleCard>
                <Ship />
                <span>Commercial</span>
            </ModuleCard>
            <ModuleCard>
                <BadgeDollarSign />
                <span>Accounting</span>
            </ModuleCard>
            <ModuleCard>
                <Forklift />
                <span>Logistic</span>
            </ModuleCard>
            <ModuleCard>
                <Stamp />
                <span>Print $ Embroidery</span>
            </ModuleCard>
        </div>
    )
}
