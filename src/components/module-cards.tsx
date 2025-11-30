
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BriefcaseBusiness, ChartGantt, Container, Factory, HandCoins, Settings, ShieldCheck, SquareChartGantt, SwatchBook } from "lucide-react"

export function ModuleCards() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-5">
            <Card className="hover:cursor-pointer">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <Settings />
                        <span>Master Settings</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <BriefcaseBusiness />
                        <span>Merchandising</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ChartGantt />
                        <span>Planning</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <SquareChartGantt />
                        <span>Procurement</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <HandCoins />
                        <span>Payroll</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <Factory />
                        <span>GMT Production</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <Container />
                        <span>Inventory</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <SwatchBook />
                        <span>Textile</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>IE</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>Quality</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>Commercial</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>Accounting</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>Logistic</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-3">
                        <ShieldCheck />
                        <span>Print $ Embroidery</span>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
