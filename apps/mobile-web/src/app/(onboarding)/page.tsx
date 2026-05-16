import Link from "next/link";
import Image from "next/image";

import { AppRoutes } from "@/constants/routes";

export default function SplashPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#2d6a2d_11.53%,#73cf73_115.18%)] text-white">
      <section className="relative mx-auto min-h-screen w-full max-w-[393px]">
        <div className="absolute inset-x-0 bottom-[27px] top-[282px] mx-auto flex w-[380px] flex-col justify-between px-2.5">
          <div className="flex w-full flex-col items-center justify-center gap-2.5 px-2.5">
            <div className="flex w-full flex-col items-center justify-center gap-2.5 px-2.5">
              <div className="relative h-[103px] w-[100px]">
                <Image
                  src="/panenin-logo.png"
                  alt="Logo PanenIn"
                  fill
                  priority
                  sizes="100px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-[28px] font-extrabold leading-none tracking-[-0.02em]">
                  PanenIn
                </h1>
                <p className="text-sm font-normal leading-[21px] text-white/95">
                  Bertani lebih cerdas, panen lebih banyak
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-5">
            <Link
              href={AppRoutes.register}
              className="flex h-[57px] w-full items-center justify-center rounded-[10px] bg-white px-2.5 py-[15px] text-center text-[18px] font-bold leading-[27px] text-[#2d6a2d] shadow-[0_10px_24px_rgba(10,42,11,0.14)] transition-transform duration-200 hover:scale-[0.99] active:scale-[0.98]"
            >
              Mulai Sekarang
            </Link>

            <p className="text-center text-[15px] font-medium leading-[22.5px]">
              Sudah punya akun?{" "}
              <Link
                href={AppRoutes.legacyLogin}
                className="font-bold underline-offset-4 transition hover:underline"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
