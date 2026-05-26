"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { AppRoutes } from "@/constants/routes";
import { useAuth } from "@/components/providers/AuthProvider";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, session } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      const target =
        pathname && pathname !== AppRoutes.login
          ? `${AppRoutes.login}?next=${encodeURIComponent(pathname)}`
          : AppRoutes.login;

      router.replace(target);
    }
  }, [loading, pathname, router, session]);

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 text-center text-[#6b6b68]">
        <p className="text-[15px] font-medium leading-[22.5px]">
          Menyiapkan sesi PanenIn...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
