import type { ReactNode } from "react";

type StickyActionBarProps = {
  children: ReactNode;
  className?: string;
};

export function StickyActionBar({
  children,
  className = "",
}: StickyActionBarProps) {
  return (
    <div className={`sticky bottom-0 z-20 bg-[#f7f7f5] px-[14px] pb-[27px] pt-4 ${className}`.trim()}>
      <div className="mx-auto flex w-full max-w-[365px] flex-col gap-[10px]">{children}</div>
    </div>
  );
}
