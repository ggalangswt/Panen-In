import type { ReactNode } from "react";
import Link from "next/link";

type ProfileMenuRowProps = {
  icon: ReactNode;
  label: string;
  href?: string;
  rightSlot?: ReactNode;
  danger?: boolean;
  description?: string;
};

export function ProfileMenuRow({
  icon,
  label,
  href,
  rightSlot,
  danger = false,
  description,
}: ProfileMenuRowProps) {
  const content = (
    <div className="flex items-center justify-between py-[15px]">
      <div className="flex items-center gap-[10px]">
        <span className="shrink-0">{icon}</span>
        <div className="flex flex-col">
          <span
            className={`text-[14px] leading-[21px] ${
              danger ? "font-bold text-[#b82c2c]" : "font-medium text-[#1a1a18]"
            }`}
          >
            {label}
          </span>
          {description ? (
            <span className="text-[12px] font-normal leading-[18px] text-[#6b6b68]">
              {description}
            </span>
          ) : null}
        </div>
      </div>
      {rightSlot}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="border-b border-[#e0e0de] last:border-b-0">
        {content}
      </Link>
    );
  }

  return <div className="border-b border-[#e0e0de] last:border-b-0">{content}</div>;
}
