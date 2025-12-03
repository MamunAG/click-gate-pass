import { ModuleIcons } from "@/components/module-icon";
import { INavMenu } from "@/components/nav-main";

export const ConfigurationMenu: INavMenu =
{
    title: "Master Settings",
    url: "#",
    icon: ModuleIcons.MasterSettings,
    items: [
        {
            title: "Example",
            url: "#",
            items: []
        },
    ],
}
