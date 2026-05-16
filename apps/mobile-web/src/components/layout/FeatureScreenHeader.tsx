"use client";

import type { ReactNode } from "react";

type FeatureScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
};

export function FeatureScreenHeader({
  title,
  onBack,
  rightSlot,
}: FeatureScreenHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[linear-gradient(90deg,#2d6a2d_14%,#73cf73_92%)]">
      <div className="mx-auto flex h-[68px] w-full max-w-[393px] items-center justify-between px-[15px] py-5">
        <div className="flex items-center gap-[15px]">
          {onBack ? (
            <button
              type="button"
              aria-label="Kembali"
              onClick={onBack}
              className="flex size-5 items-center justify-center text-white"
            >
              <svg
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.5 4.5 7 10l5.5 5.5" />
                <path d="M7.5 10h8" />
              </svg>
            </button>
          ) : null}

          <h1 className="text-[18px] font-bold leading-[27px] text-white">{title}</h1>
        </div>

        {rightSlot ? <div>{rightSlot}</div> : onBack ? <div className="w-5" aria-hidden="true" /> : null}
      </div>
    </header>
  );
}
