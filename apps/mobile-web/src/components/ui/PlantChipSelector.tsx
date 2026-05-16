import type { PlantId } from "@/constants/plants";
import { plantOptions } from "@/constants/plants";

type PlantChipSelectorProps = {
  selectedId: PlantId;
  onSelect: (id: PlantId) => void;
};

export function PlantChipSelector({
  selectedId,
  onSelect,
}: PlantChipSelectorProps) {
  return (
    <div className="flex gap-[10px] overflow-x-auto pb-1">
      {plantOptions.map((plant) => {
        const isSelected = plant.id === selectedId;

        return (
          <button
            key={plant.id}
            type="button"
            onClick={() => onSelect(plant.id)}
            className={`shrink-0 rounded-full border px-[30px] py-[10px] text-[12px] font-medium leading-[18px] transition-colors ${
              isSelected
                ? "border-[#c6dfc6] bg-[#ebf5eb] text-[#2d6a2d]"
                : "border-[#e0e0de] bg-white text-[#6b6b68]"
            }`}
          >
            {plant.label}
          </button>
        );
      })}
    </div>
  );
}
