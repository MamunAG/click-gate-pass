"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { AppMenu } from "@/pages/app-menu"

// This is sample data.
const data = {
    user: {
        name: "Najmuzzaman",
        email: "najmuzzaman@clickerp.com.bd",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Anowara Cotton",
            logo: GalleryVerticalEnd,
            plan: "Narayanganj",
        },
        {
            name: "Anowara Fashion",
            logo: AudioWaveform,
            plan: "Narayanganj",
        },
        {
            name: "Anowara Knit Composite.",
            logo: Command,
            plan: "Gazipur",
        },
    ],
    navMain: AppMenu,
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full">
                    <NavMain items={data.navMain} />
                    {/* <NavProjects projects={data.projects} /> */}
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
