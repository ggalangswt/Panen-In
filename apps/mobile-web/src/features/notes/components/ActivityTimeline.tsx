type ActivityTimelineProps = {
  items: Array<{
    date: string;
    title: string;
    description: string;
  }>;
};

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <div className="flex flex-col gap-[10px] px-[10px]">
      {items.map((item) => (
        <div key={`${item.date}-${item.title}`} className="grid grid-cols-[48px_1fr] gap-[25px]">
          <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
            {item.date}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-medium leading-[22.5px] text-[#1a1a18]">
              {item.title}
            </p>
            <p className="text-[15px] font-normal leading-[22.5px] text-[#6b6b68]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
