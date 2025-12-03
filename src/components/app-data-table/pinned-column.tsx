/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@tanstack/react-table";
import { useTheme } from "@/components/theme-provider";

export const GetCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const { theme } = useTheme();
  const isPinned = column.getIsPinned();
  const isLeftPinned = isPinned === "left";

  // Determine background color based on current theme
  let backgroundColor = "";
  if (isPinned) {
    if (theme === "dark") {
      backgroundColor = "#0a0a0a"; 
    } else if (theme === "light") {
      backgroundColor = "#ffffff"; 
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      backgroundColor = prefersDark ? "#0a0a0a" : "#ffffff";
    }
  }

  return {
    backgroundColor: isPinned ? backgroundColor : undefined,
    boxShadow: isLeftPinned
      ? "4px 0 4px -4px rgba(0, 0, 0, 0.1)"
      : isPinned === "right"
      ? "-4px 0 4px -4px rgba(0, 0, 0, 0.1)"
      : undefined,
    left: isLeftPinned ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 10 : 0,
  };
};
