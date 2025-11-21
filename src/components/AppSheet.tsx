import { Button } from "@/components/ui/button"
import {
    Sheet,
    // SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react";
type AppSheetType = {
    title: string,
    description?: string,
    children?: React.ReactNode;
    btnText?: string;
    sheetTrigger?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    width?: string;
}
export function AppSheet(params: AppSheetType) {
    return (
        <Sheet onOpenChange={params.onOpenChange}>
            <SheetTrigger asChild>
                {params.sheetTrigger ?? <Button size={"sm"} variant="outline" type="button" className="cursor-pointer"><Plus />{params.btnText}</Button>}
            </SheetTrigger>
            <SheetContent className={`z-999 bg-white overflow-y-auto`} style={{ maxWidth: `${params.width}` }}>
                <SheetHeader>
                    <SheetTitle>{params.title ?? 'Edit profile'}</SheetTitle>
                    <SheetDescription>
                        {params.description}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    {/* <div className="grid gap-3">
                        <Label htmlFor="sheet-demo-name">Name</Label>
                        <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="sheet-demo-username">Username</Label>
                        <Input id="sheet-demo-username" defaultValue="@peduarte" />
                    </div> */}
                    {params.children}
                </div>
                <SheetFooter>
                    {/* <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose> */}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
