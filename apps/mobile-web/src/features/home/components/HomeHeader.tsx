import { paneninColors } from "@panenin/ui";

type HomeHeaderProps = {
  greeting: string;
  subtitle: string;
  initial: string;
};

export function HomeHeader({ greeting, subtitle, initial }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[linear-gradient(90deg,#2d6a2d_7.75%,#73cf73_85.12%)]">
      <div className="mx-auto flex w-full max-w-[393px] items-center justify-between px-[15px] py-[10px]">
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-normal leading-[22.5px] text-white">{greeting}</p>
          <p className="text-[15px] font-medium leading-[22.5px] text-[#f7f7f5]">{subtitle}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-[#ebf5eb]">
          <span
            className="text-[15px] font-medium leading-[22.5px]"
            style={{ color: paneninColors.neutral.ne50 }}
          >
            {initial}
          </span>
        </div>
      </div>
    </header>
  );
}
