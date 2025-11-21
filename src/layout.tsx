import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout(/*{ children }: { children: React.ReactNode }*/) {
    // const cookieStore = await cookies()
    // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider /*defaultOpen={defaultOpen}*/ className="border border-blue-500">
            <AppSidebar />
            <main className="border border-red-400">
                <SidebarTrigger />
                {/* {children} */}
                <Outlet />
            </main>
        </SidebarProvider>
    )
}