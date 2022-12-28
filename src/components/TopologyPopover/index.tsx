import { TopologyPreference } from "./TopologyPreference";
import { defaultSortLabels, TopologySort } from "./TopologySort";

type TopologyPopOverProps = {
  size: string;
  sortLabels: typeof defaultSortLabels;
  setSize: (v: string) => void;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  sortBy?: string;
  sortOrder?: string;
};

export function TopologyPopOver({
  size,
  setSize,
  sortLabels,
  sortBy,
  sortOrder,
  onSortChange
}: TopologyPopOverProps) {
  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  return (
    <div className="relative pt-5 sm:flex md:self-center md:pt-0 pl-3 flex items-center">
      <TopologySort
        sortLabels={sortLabels}
        onSortChange={onSortChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <TopologyPreference cardSize={size} setCardWidth={setCardWidth} />
    </div>
  );
}

export default TopologyPopOver;
