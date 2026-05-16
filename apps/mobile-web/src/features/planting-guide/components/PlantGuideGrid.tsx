import type { PlantId } from "@/constants/plants";
import { plantOptions } from "@/constants/plants";

type PlantGuideGridProps = {
  onSelect: (id: PlantId) => void;
};

export function PlantGuideGrid({ onSelect }: PlantGuideGridProps) {
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {plantOptions.map((plant) => (
        <button
          key={plant.id}
          type="button"
          onClick={() => onSelect(plant.id)}
          className="flex h-[160px] flex-col items-center justify-center rounded-[10px] border border-[#e0e0de] bg-white"
        >
          <span className="mb-2 text-[28px] leading-none">{plant.emoji}</span>
          <span className="text-[12px] font-medium leading-[18px] text-[#1a1a18]">
            {plant.label}
          </span>
        </button>
      ))}
    </div>
  );
}
