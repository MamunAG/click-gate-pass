/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@tanstack/react-table";
import { useTheme } from "@/components/theme-provider";

export const usePinningStyles = () => {
  const { theme } = useTheme();
  
  const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
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
      backgroundClip: isPinned ? "padding-box" : undefined,
      boxShadow: isLeftPinned
        ? "2px 0 4px rgba(0, 0, 0, 0.1)"
        : isPinned === "right"
        ? "-2px 0 4px rgba(0, 0, 0, 0.1)"
        : undefined,
      left: isLeftPinned ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      minWidth: isPinned ? column.getSize() : undefined,
      maxWidth: isPinned ? column.getSize() : undefined,
      zIndex: isPinned ? 100 : 0,
      borderRight: isLeftPinned && column.getIndex() === 2 ? "1px solid hsl(var(--border))" : undefined,
    };
  };
  
  return { getCommonPinningStyles };
};
