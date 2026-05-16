type ConsultationResultCardProps = {
  title: string;
  items: string[];
  accent?: boolean;
};

export function ConsultationResultCard({
  title,
  items,
  accent = false,
}: ConsultationResultCardProps) {
  return (
    <article className="rounded-[10px] border border-[#e0e0de] bg-white p-[15px]">
      <div className="border-b border-[#e0e0de] pb-2">
        <h2
          className={`text-[14px] font-medium leading-[21px] ${
            accent ? "text-[#2d6a2d]" : "text-[#1a1a18]"
          }`}
        >
          {title}
        </h2>
      </div>

      <ul className="mt-[10px] flex flex-col gap-[10px]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span
              className={`mt-[7px] block size-[7px] shrink-0 rounded-full ${
                accent ? "bg-[#2d6a2d]" : "bg-[#1a1a18]"
              }`}
            />
            <span
              className={`text-[14px] font-medium leading-[21px] ${
                accent ? "text-[#2d6a2d]" : "text-[#3d3d3a]"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
