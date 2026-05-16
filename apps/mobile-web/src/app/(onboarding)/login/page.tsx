"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppRoutes } from "@/constants/routes";
import { CarouselDots } from "@/features/onboarding/components/CarouselDots";
import { AuthInputField } from "@/features/onboarding/components/AuthInputField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#1a1a18]">
      <section className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col items-center px-[6px] pt-16">
        <div className="flex w-full min-h-screen flex-col items-center gap-2.5">
          <div className="flex w-full flex-col items-center gap-[15px]">
            <CarouselDots activeIndex={0} total={4} />
            <div
              className="h-[320px] w-[350px] rounded-[20px] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/login-hero.png')" }}
            />
          </div>

          <div className="flex min-h-0 w-[380px] flex-1 flex-col px-2.5 py-2.5">
            <div className="flex w-full flex-col items-center gap-5 px-2.5 py-2.5">
              <div className="flex w-full flex-col items-center justify-center gap-2.5 px-2.5 py-2.5 text-center">
                <h1 className="text-[22px] font-medium leading-[29px] text-[#1a1a18]">
                  Selamat datang kembali
                </h1>
                <p className="text-sm font-normal leading-[21px] text-[#6b6b68]">
                  Masuk untuk lanjutkan ke PanenIn
                </p>
              </div>

              <div className="flex w-full flex-col gap-2.5">
                <AuthInputField
                  icon="password"
                  placeholder="Masukkan password"
                  type="password"
                />
                <AuthInputField
                  icon="email"
                  placeholder="Tulis emailmu di sini"
                  type="email"
                />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 -mx-[16px] mt-auto bg-[#f7f7f5] px-[16px] pb-6 pt-4">
              <div className="flex w-full flex-col items-center gap-2.5">
                <PrimaryButton
                  variant="solid"
                  fullWidth
                  onClick={() => router.push(AppRoutes.home)}
                >
                  Masuk
                </PrimaryButton>
                <p className="text-center text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]">
                  Belum punya akun?{" "}
                  <Link
                    href={AppRoutes.register}
                    className="font-bold underline-offset-4 hover:underline"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
