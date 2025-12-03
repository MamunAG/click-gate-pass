import { ModuleIcons } from "@/components/module-icon";
import { INavMenu } from "@/components/nav-main";
import FactoryWiseMenuPermissionIndex from "./factory-wise-menu-permission/factory-wise-menu-permission-index";
import FactoryWiseMenuPermissionCRUD from "./factory-wise-menu-permission/curd/factory-wise-menu-permission-crud-index";

export const ConfigurationMenu: INavMenu =
{
    title: "Master Settings",
    url: "#",
    icon: ModuleIcons.MasterSettings,
    items: [
        {
            title: "Basic Setup",
            isMeuItem: true,
            items: [
                {
                    title: "Factory Wise Menu Permission",
                    isMeuItem: true,
                    url: 'configuration/factory-wise-menu-permission',
                    element: <FactoryWiseMenuPermissionIndex />
                },
                {
                    title: "Factory Wise Menu Permission crud",
                    isMeuItem: false,
                    url: 'configuration/factory-wise-menu-permission/:pageAction/:id',
                    element: <FactoryWiseMenuPermissionCRUD />
                },
            ]
        },
    ],
}
