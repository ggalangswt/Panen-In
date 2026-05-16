type GuideStageCardProps = {
  index: number;
  title: string;
  badge: string;
  items: string[];
};

export function GuideStageCard({
  index,
  title,
  badge,
  items,
}: GuideStageCardProps) {
  return (
    <article className="rounded-[20px] border border-[#e0e0de] bg-white px-5 py-[15px]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-[22.5px] text-[#1a1a18]">
          {index}. {title}
        </h3>
        <span className="shrink-0 rounded-full border border-[#c6dfc6] bg-[#fffbea] px-[10px] py-1 text-[12px] font-medium leading-[18px] text-[#2d6a2d]">
          {badge}
        </span>
      </div>

      <div className="mt-[15px] flex flex-col gap-1">
        {items.map((item) => (
          <p key={item} className="text-[14px] font-normal leading-[21px] text-[#6b6b68]">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
