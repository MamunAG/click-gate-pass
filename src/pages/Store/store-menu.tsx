import { ModuleIcons } from "@/components/module-icon";
import { INavMenu } from "@/components/nav-main";
import GatePassIndex from "../gate-pass/gate-pass-index";
import GatePassCRUD from "../gate-pass/crud/gate-pass-crud-index";

export const StoreMenu: INavMenu =
{
    title: "Inventory",
    url: "#",
    icon: ModuleIcons.Inventory,
    items: [
        {
            title: "Gate-pass",
            url: "inventory/gate-pass",
            element: <GatePassIndex />,
            isMeuItem: true,
        },
        {
            title: "Gate-pass Crud",
            url: "inventory/gate-pass/:pageAction/:id",
            element: <GatePassCRUD />,
            isMeuItem: false,
        },
        {
            title: "Inventory Config",
            url: "#",
            items: [
                {
                    title: "Rack Setup",
                    url: "inventory/gate-pass",
                    isMeuItem: true,
                },
                {
                    title: "Store Setup",
                    url: "#",
                    isMeuItem: true,
                }]
        },
    ],
}

















// {
//     title: "Store",
//     url: "#",
//     items: [
//         {
//             title: "Inventory Requ.",
//             items: [
//                 {
//                     title: "Internal Requisition",
//                     url: "#",
//                 },
//                 {
//                     title: "Requisition Approval",
//                     url: "#",
//                 },
//                 {
//                     title: "General Material Issue",
//                     url: "#",
//                 },
//             ]
//         },
//         {
//             title: "General Material Transfer",
//             url: "inventory/gate-pass",
//         }
//     ]
// },