type SummaryMetric = {
  label: string;
  value: string;
  valueColor?: string;
};

type SeasonSummaryCardProps = {
  seasonLabel: string;
  status: string;
  metrics: SummaryMetric[];
};

export function SeasonSummaryCard({
  seasonLabel,
  status,
  metrics,
}: SeasonSummaryCardProps) {
  return (
    <article className="flex flex-col gap-[15px] rounded-[20px] border border-[#e0e0de] bg-white px-5 py-[15px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold leading-[21px] text-[#1a1a18]">{seasonLabel}</h3>
        <div className="rounded-full border border-[#f7f7f5] bg-[#ebf5eb] px-[10px] py-1">
          <span className="text-[14px] font-medium leading-[21px] text-[#2d6a2d]">{status}</span>
        </div>
      </div>

      <div className="flex items-start justify-between">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-[10px] p-[10px]">
            <span className="text-[14px] font-medium leading-[21px] text-[#6b6b68]">
              {metric.label}
            </span>
            <span
              className="text-[15px] font-bold leading-[22.5px]"
              style={{ color: metric.valueColor ?? "#1a1a18" }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
