"use client";

import Link from "next/link";
import { paneninColors } from "@panenin/ui";

import { AppRoutes } from "@/constants/routes";

type BottomNavTab = "home" | "notes" | "profile";

type BottomNavProps = {
  activeTab?: BottomNavTab;
};

const items = [
  { key: "home", label: "Home", href: AppRoutes.home },
  { key: "notes", label: "Catatan", href: AppRoutes.notes },
  { key: "profile", label: "Profil", href: AppRoutes.profile },
] as const;

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5 10 3.8l6.5 4.7v7a1 1 0 0 1-1 1h-3.3V11H7.8v5.5H4.5a1 1 0 0 1-1-1v-7Z" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5h8.5v13H5.5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H8" />
      <path d="M8 3.5v4h4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6.4" r="2.6" />
      <path d="M5.8 16a4.2 4.2 0 0 1 8.4 0" />
    </svg>
  );
}

function NavIcon({ tab }: { tab: BottomNavTab }) {
  if (tab === "home") return <HomeIcon />;
  if (tab === "notes") return <NotesIcon />;
  return <ProfileIcon />;
}

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    <div className="sticky bottom-0 z-20 bg-[#f7f7f5]">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-[77px] w-full max-w-[393px] items-center justify-center gap-[10px] border-t border-[#e0e0de] bg-white px-[22px] py-[10px]"
      >
        {items.map((item) => {
          const isActive = item.key === activeTab;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex w-[109.667px] flex-col items-center justify-center rounded-[10px] px-5 py-2 ${
                isActive
                  ? "bg-[linear-gradient(90deg,rgba(45,106,45,0.9)_7.75%,rgba(115,207,115,0.9)_85.12%)] text-white"
                  : "text-[#6b6b68]"
              }`}
            >
              <span style={{ color: isActive ? paneninColors.neutral.ne00 : paneninColors.neutral.ne30 }}>
                <NavIcon tab={item.key} />
              </span>
              <span className="text-[12px] font-medium leading-[18px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
