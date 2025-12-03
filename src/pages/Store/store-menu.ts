import { ModuleIcons } from "@/components/module-icon";

export const StoreMenu =
{
    title: "Inventory",
    url: "#",
    icon: ModuleIcons.Inventory,
    // isActive: true,
    items: [
        {
            title: "Gate-pass",
            url: "/dashboard/gate-pass",
            items: []
        },
        {
            title: "Inventory Config",
            url: "#",
            items: [
                {
                    title: "Rack Setup",
                    url: "/dashboard/gate-pass",
                },
                {
                    title: "Store Setup",
                    url: "#",
                }]
        },
        {
            title: "Store",
            url: "#",
            items: [
                {
                    title: "Inventory Requ.",
                    items: [
                        {
                            title: "Internal Requisition",
                            url: "#",
                        },
                        {
                            title: "Requisition Approval",
                            url: "#",
                        },
                        {
                            title: "General Material Issue",
                            url: "#",
                        },
                    ]
                },
                {
                    title: "General Material Transfer",
                    url: "/dashboard/gate-pass",
                }
            ]
        },
    ],
}
