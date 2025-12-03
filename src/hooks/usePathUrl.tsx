import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function usePathUrl(count: number = 2) {
    const { pathname } = useLocation();

    return useMemo(() => {
        const parts = pathname.split("/").filter(Boolean);

        // remove last `count` segments
        const trimmed = parts.slice(0, parts.length - count);

        return "/" + trimmed.join("/");
    }, [pathname, count]);
}