type CalculationHeroCardProps = {
  plantLabel: string;
  profit: string;
  modal: string;
  revenue: string;
  margin: string;
};

export function CalculationHeroCard({
  plantLabel,
  profit,
  modal,
  revenue,
  margin,
}: CalculationHeroCardProps) {
  return (
    <article className="rounded-[10px] border border-[#c6dfc6] bg-[#ebf5eb] p-[15px]">
      <p className="text-[14px] font-bold leading-[21px] text-[#2d6a2d]">{plantLabel}</p>

      <div className="mt-[15px] flex flex-col items-center gap-2 text-center text-[#2d6a2d]">
        <p className="text-[14px] font-medium leading-[21px]">Keuntungan Besih</p>
        <p className="text-[22px] font-medium leading-[29px]">{profit}</p>
        <div className="rounded-full border border-[#c6dfc6] bg-white px-[10px] py-2 text-[14px] font-medium leading-[21px]">
          Musim ini untung
        </div>
      </div>

      <div className="mt-[15px] grid grid-cols-3 gap-[10px]">
        {[
          { label: "Modal", value: modal },
          { label: "Pendapatan", value: revenue },
          { label: "Margin", value: margin },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[10px] border border-[#e0e0de] bg-white px-3 py-[10px] text-center"
          >
            <p className="text-[12px] font-medium leading-[18px] text-[#6b6b68]">
              {item.label}
            </p>
            <p className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
