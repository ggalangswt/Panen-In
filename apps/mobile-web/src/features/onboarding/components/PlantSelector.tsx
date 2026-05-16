const cropOptions = [
  { id: "padi", label: "Padi", emoji: "🌾" },
  { id: "jagung", label: "Jagung", emoji: "🌽" },
  { id: "cabai", label: "Cabai", emoji: "🌶️" },
  { id: "tomat", label: "Tomat", emoji: "🍅" },
  { id: "bawang", label: "Bawang", emoji: "🧄" },
  { id: "singkok", label: "Singkok", emoji: "🌱" },
  { id: "kedelai", label: "Kedelai", emoji: "🫘" },
  { id: "sayuran-hijau", label: "Sayuran Hijau", emoji: "🥬" },
] as const;

type PlantSelectorProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function PlantSelector({ selectedIds, onToggle }: PlantSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {cropOptions.map((crop) => {
        const isSelected = selectedIds.includes(crop.id);

        return (
          <button
            key={crop.id}
            type="button"
            onClick={() => onToggle(crop.id)}
            className={`relative flex h-[174px] flex-col items-center justify-center rounded-[10px] border text-center transition-colors ${
              isSelected
                ? "border-[#2d6a2d] bg-[#ebf5eb]"
                : "border-[#e0e0de] bg-white"
            }`}
          >
            {isSelected ? (
              <span className="absolute right-[10px] top-[10px] flex size-5 items-center justify-center rounded-full bg-[#2d6a2d] text-[11px] text-white">
                ✓
              </span>
            ) : null}

            <span className="mb-2 text-[28px] leading-none">{crop.emoji}</span>
            <span
              className={`text-[12px] font-medium leading-[18px] ${
                isSelected ? "text-[#2d6a2d]" : "text-[#1a1a18]"
              }`}
            >
              {crop.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
