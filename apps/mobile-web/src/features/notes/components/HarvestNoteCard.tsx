import Link from "next/link";

type HarvestNoteCardProps = {
  href: string;
  emoji: string;
  plant: string;
  status: string;
  summary: string;
};

export function HarvestNoteCard({
  href,
  emoji,
  plant,
  status,
  summary,
}: HarvestNoteCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-[15px] rounded-[20px] border border-[#e0e0de] bg-white px-5 py-[15px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[25px] leading-none">{emoji}</span>
          <span className="text-[18px] font-bold leading-[27px] text-[#1a1a18]">
            {plant}
          </span>
        </div>
        <span className="rounded-full border border-[#c6dfc6] bg-[#ebf5eb] px-[10px] py-1 text-[14px] font-medium leading-[21px] text-[#2d6a2d]">
          {status}
        </span>
      </div>
      <p className="px-[10px] text-[14px] font-medium leading-[21px] text-[#2d6a2d]">
        {summary}
      </p>
    </Link>
  );
}
