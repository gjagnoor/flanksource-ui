import clsx from "clsx";
import { uniq } from "lodash";
import { LegacyRef } from "react";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import type { Topology, ValueType } from "../../context/TopologyPageContext";
import { useOnMouseActivity } from "../../hooks/useMouseActivity";
import { saveSortBy, saveSortOrder } from "../../pages/TopologyPage";
import { isDate } from "../../utils/date";

const STATUS = {
  info: 0,
  healthy: 1,
  warning: 2,
  unhealthy: 3
};

export const defaultSortLabels = [
  { id: 1, value: "status", label: "Health", standard: true },
  { id: 2, value: "name", label: "Name", standard: true },
  { id: 3, value: "type", label: "Type", standard: true },
  { id: 4, value: "updated_at", label: "Last Updated", standard: true }
];

export function getSortLabels(topology: Topology[]) {
  const currentSortLabels: typeof defaultSortLabels = [];
  let labels: Record<string, boolean> = {};
  topology?.forEach((t) => {
    t?.properties?.forEach((h, index) => {
      if (!h.name) {
        return;
      }
      if (h.headline && h.name && !labels[h.name]) {
        labels[h.name] = true;
        currentSortLabels.push({
          id: defaultSortLabels.length + index,
          value: (h.name ?? "").toLowerCase(),
          label: h.name ?? "",
          standard: false
        });
      }
    });
  });
  return [...defaultSortLabels, ...uniq(currentSortLabels)];
}

function getTopologyValue(t: Topology, sortBy: string) {
  if (!!t[sortBy as keyof Topology]) {
    return t[sortBy as keyof Topology] as ValueType;
  }

  const property = t?.properties?.find((p) => p.name === sortBy);
  if (property) {
    return property.value as ValueType;
  }

  return undefined;
}

export function getSortedTopology(
  topology: Topology[] = [],
  sortBy: string,
  sortByType: string
) {
  const topologyMap = new Map(topology.map((p) => [p.id, p]));

  let updatedTopology = [...topologyMap.values()].sort((t1, t2) => {
    let t1Value = getTopologyValue(t1, sortBy);
    let t2Value = getTopologyValue(t2, sortBy);

    if (t1Value && (!t2Value || t2Value === null)) {
      return 1;
    }
    if (t2Value && (!t1Value || t1Value === null)) {
      return -1;
    }

    if (isDate(t1Value) && isDate(t2Value)) {
      return (
        new Date(t1Value as string).getDate() -
        new Date(t2Value as string).getDate()
      );
    }

    if (sortBy === "status") {
      t1Value = STATUS[t1Value as keyof typeof STATUS];
      t2Value = STATUS[t2Value as keyof typeof STATUS];
    }

    if (t1Value && t2Value) {
      return +(t1Value > t2Value) || -(t1Value < t2Value);
    }

    return 0;
  });

  if (sortByType === "desc") {
    return updatedTopology.reverse();
  }

  return updatedTopology;
}

type SortLabel = typeof defaultSortLabels;

type SortOptionProps = {
  title?: string;
  sortLabels: SortLabel;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  sortBy?: string;
  sortOrder?: string;
};

export function TopologySort({
  title = "Sort By",
  sortLabels,
  onSortChange = () => {},
  sortBy,
  sortOrder
}: SortOptionProps) {
  const {
    ref: popoverRef,
    isActive: isPopoverActive,
    setIsActive: setIsPopoverActive
  } = useOnMouseActivity();

  function onSelectSortOption(sortBy?: string, sortOrder?: string) {
    saveSortBy(sortBy ?? "status", sortLabels);
    saveSortOrder(sortOrder ?? "desc");
    onSortChange(sortBy ?? "status", sortOrder ?? "desc");
    setIsPopoverActive(false);
  }

  return (
    <>
      <div
        // there is a mismatch between react types version and react version, we
        // need to fix this by deciding whether to upgrade react to ^18 or downgrade react
        // types to ^17
        ref={popoverRef as LegacyRef<HTMLDivElement>}
        className="flex mt-1 cursor-pointer md:mt-0 md:items-center border border-gray-300 bg-white rounded-md shadow-sm px-3 py-2"
      >
        {sortOrder === "asc" && (
          <BsSortUp
            className="w-5 h-5 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "desc")}
          />
        )}
        {sortOrder === "desc" && (
          <BsSortDown
            className="w-5 h-5 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "asc")}
          />
        )}
        <span
          className="flex ml-2 text-sm text-gray-700 capitalize bold hover:text-gray-900"
          onClick={() => setIsPopoverActive((val) => !val)}
        >
          {sortLabels.find((s) => s.value === sortBy)?.label}
        </span>
      </div>
      <div className="relative">
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          className={clsx(
            "origin-top-right absolute right-0 mt-6 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize w-48",
            isPopoverActive ? "display-block" : "hidden"
          )}
        >
          <div className="py-1">
            <div className="flex items-center justify-between px-4 py-2 text-base">
              <span className="font-bold text-gray-700">{title}</span>
              <div
                onClick={() =>
                  onSelectSortOption(
                    sortBy,
                    sortOrder === "asc" ? "desc" : "asc"
                  )
                }
                className="flex mx-1 text-gray-600 cursor-pointer hover:text-gray-900"
              >
                {sortOrder === "asc" && <BsSortUp className="w-5 h-5" />}
                {sortOrder === "desc" && <BsSortDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
          <div className="py-1" role="none">
            <div className="flex flex-col">
              {sortLabels.map((s) => (
                <span
                  key={s.value}
                  onClick={() =>
                    onSelectSortOption(
                      s.value,
                      sortBy !== s.value
                        ? sortOrder
                        : sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    )
                  }
                  className="flex px-4 py-1 text-base cursor-pointer hover:bg-blue-100"
                  style={{
                    fontWeight: sortBy === s.value ? "bold" : "inherit"
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
