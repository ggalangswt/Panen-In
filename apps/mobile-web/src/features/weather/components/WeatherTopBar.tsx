import Link from "next/link";

import { AppRoutes } from "@/constants/routes";

type WeatherTopBarProps = {
  title: string;
};

export function WeatherTopBar({ title }: WeatherTopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-[linear-gradient(90deg,#2d6a2d_7.75%,#73cf73_85.12%)]">
      <div className="mx-auto flex w-full max-w-[393px] items-center px-[15px] py-5">
        <div className="flex items-center gap-[15px]">
          <Link
            href={AppRoutes.home}
            aria-label="Kembali ke beranda"
            className="inline-flex h-[19px] w-[20px] items-center justify-center text-white"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-[19px] w-[20px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m11.8 3.8-6 6 6 6" />
            </svg>
          </Link>
          <h1 className="text-[18px] font-bold leading-[27px] text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
}
