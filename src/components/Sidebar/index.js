import { useEffect, useState } from "react";
import { IoChevronBackCircle } from "react-icons/io5";
import { useWindowDimensions } from "../Hooks/useWindowDimensions";

export function Sidebar({
  animated = false,
  settings,
  flipped = false,
  floatWidthRange,
  forceSetCollapsed,
  ...rest
}) {
  const { children, className } = rest;
  const [collapsed, setCollapsed] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const willFloat = floatWidthRange && floatWidthRange.length === 2;
  const float =
    willFloat &&
    screenWidth > floatWidthRange[0] &&
    screenWidth < floatWidthRange[1];
  const direction = flipped ? "right" : "left";

  useEffect(() => {
    if (forceSetCollapsed != null) {
      setCollapsed(forceSetCollapsed);
    }
  }, [forceSetCollapsed]);

  return (
    <div
      className={`border border-gray-200 h-screen 
        ${collapsed ? "border-l-0" : ""} 
        ${
          float
            ? `fixed ${flipped ? "left" : "right"}-0 top-0 z-50 shadow-lg`
            : "sticky top-0"
        } 
      `}
    >
      <button
        title={`${collapsed ? "Show" : "Hide"} sidebar`}
        className={`z-10 transform absolute top-5 
          ${collapsed === flipped ? "rotate-180" : ""}
          ${
            float
              ? collapsed
                ? `-${direction}-8`
                : `-${direction}-3`
              : `-${direction}-3`
          } 
        `}
        type="button"
        onClick={() => setCollapsed(!collapsed)}
      >
        <IoChevronBackCircle className="h-6 w-6 text-gray-500" />
      </button>
      <div
        className={`flex-shrink-0 bg-gray-50 h-full overflow-x-hidden overflow-y-auto ${
          animated ? "transform duration-200" : ""
        } ${className || ""}`}
        style={{ width: collapsed ? "0" : "310px" }}
      >
        <div className="p-4" style={{ minWidth: animated ? "300px" : "" }}>
          {!collapsed && children}
        </div>
      </div>
    </div>
  );
}

export function Sidebar2({
  floatWidthRange,
  animated = false,
  settings,
  ...rest
}) {
  const { children, className } = rest;
  const [collapsed, setCollapsed] = useState(false);
  // const float = floatWidthRange && floatWidthRange.length === 2;

  return (
    <div
      className={`border border-gray-200 h-screen
        ${collapsed ? "border-l-0" : ""}
        ${float ? "fixed right-0 top-0 z-50" : "sticky top-0"} 
        ${className || ""}
      `}
    >
      <button
        title={`${collapsed ? "Show" : "Hide"} sidebar`}
        className={`z-10 transform absolute top-5  
          ${collapsed ? "" : "rotate-180"}
          ${float ? (collapsed ? "-left-8" : "-left-3") : "-left-3"} 
        `}
        type="button"
        onClick={() => setCollapsed(!collapsed)}
      >
        <IoChevronBackCircle className="h-6 w-6 text-gray-500" />
      </button>
      <div
        className={`flex-shrink-0 bg-gray-50 h-full overflow-x-hidden overflow-y-auto ${
          animated ? "transform duration-200" : ""
        }`}
        style={{ width: collapsed ? "0" : "310px" }}
      >
        <div className="p-4" style={{ minWidth: animated ? "300px" : "" }}>
          {!collapsed && children}
        </div>
      </div>
    </div>
  );
}
