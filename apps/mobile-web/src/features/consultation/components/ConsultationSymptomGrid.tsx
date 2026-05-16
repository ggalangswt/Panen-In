type ConsultationSymptomGridProps = {
  symptoms: readonly string[];
  selectedSymptom: string;
  onSelect: (symptom: string) => void;
};

export function ConsultationSymptomGrid({
  symptoms,
  selectedSymptom,
  onSelect,
}: ConsultationSymptomGridProps) {
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {symptoms.map((symptom) => {
        const isSelected = selectedSymptom === symptom;

        return (
          <button
            key={symptom}
            type="button"
            onClick={() => onSelect(symptom)}
            className={`flex min-h-[68px] items-center justify-center rounded-[10px] border px-5 py-[22px] text-center text-[12px] font-medium leading-[18px] transition-colors ${
              isSelected
                ? "border-[#c6dfc6] bg-[#ebf5eb] text-[#2d6a2d]"
                : "border-[#e0e0de] bg-white text-[#6b6b68]"
            }`}
          >
            {symptom}
          </button>
        );
      })}
    </div>
  );
}
