type WeatherAdviceCardProps = {
  title: string;
  items: readonly string[];
};

export function WeatherAdviceCard({ title, items }: WeatherAdviceCardProps) {
  return (
    <section className="rounded-[10px] border border-[#c6dfc6] bg-[#ebf5eb] p-[15px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[14px] font-bold leading-[21px] text-[#1a4d1a]">{title}</h2>
        {items.map((item, index) => (
          <div
            key={`${index}-${item}`}
            className={index < items.length - 1 ? "border-b border-[#e0e0de] px-[10px] pb-[10px]" : "px-[10px]"}
          >
            <p className="text-[12px] font-normal leading-[18px] text-[#1a4d1a]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
