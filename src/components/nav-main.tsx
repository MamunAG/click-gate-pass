"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export type INavMenu = {
    title: string
    menuName?: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    isMeuItem?: boolean
    element?: React.ReactNode
    items?: INavMenu[]
}

export function NavMain({
    items,
}: {
    items: INavMenu[]
}) {

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Module</SidebarGroupLabel>
            <SidebarMenu>
                {/* Module */}
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                    </Collapsible>
                                    {item.items?.map((subItem) => (
                                        subItem?.items?.length ?
                                            (<NavBarCollapsibleMenu {...subItem} />) :
                                            (<NavBarMenuSubItem  {...subItem} />)
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
                {/* End Module */}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function NavBarMenuSubItem(props: INavMenu) {
    if (props.isMeuItem)
        return (

            <SidebarMenuSubItem key={props.title}>
                <SidebarMenuSubButton asChild>
                    <Link to={props.url ?? '#'}>
                        <span>{props.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        )
}

function NavBarCollapsibleMenu(props: INavMenu) {
    if (props)
        return (
            <Collapsible
                key={props.title}
                asChild
                defaultOpen={props.isActive}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={props.title}>
                            {props.icon && <props.icon />}
                            <span>{props.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {props.items?.map((subItem) => (
                                subItem?.items?.length ?
                                    (<NavBarCollapsibleMenu {...subItem} />) :
                                    subItem.isMeuItem &&
                                    (<SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton asChild>
                                            <Link to={subItem.url ?? '#'}>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>)
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>

        )
}