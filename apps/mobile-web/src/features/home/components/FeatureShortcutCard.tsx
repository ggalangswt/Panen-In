import type { ReactNode } from "react";
import Link from "next/link";

type FeatureShortcutCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
};

export function FeatureShortcutCard({
  icon,
  title,
  description,
  href,
}: FeatureShortcutCardProps) {
  const content = (
    <article className="flex h-full min-h-[112px] w-full flex-col items-start justify-between rounded-[20px] border border-[#e0e0de] bg-white px-5 py-[15px] transition-colors hover:border-[#c6dfc6]">
      <div className="text-[#1a4d1a]">{icon}</div>
      <div className="flex min-h-[40px] flex-col items-start justify-end">
        <h3 className="text-[14px] font-medium leading-[21px] text-[#1a4d1a]">{title}</h3>
        <p className="text-[10px] font-normal leading-[15px] text-[#6b6b68]">{description}</p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full w-full">
        {content}
      </Link>
    );
  }

  return content;
}
