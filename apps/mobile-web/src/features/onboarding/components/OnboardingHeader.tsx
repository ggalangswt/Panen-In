import Image from "next/image";
import { paneninColors } from "@panenin/ui";

import { OnboardingProgress } from "@/features/onboarding/components/OnboardingProgress";

type OnboardingHeaderProps = {
  activeStep: number;
};

export function OnboardingHeader({ activeStep }: OnboardingHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[linear-gradient(90deg,#2d6a2d_19.37%,#73cf73_106.01%)]">
      <div className="mx-auto flex h-[70px] w-full max-w-[393px] items-center justify-between px-[15px] py-[10px]">
        <div className="flex items-center gap-[5px]">
          <div className="relative size-[50px]">
            <Image
              src="/panenin-logo.png"
              alt="Logo PanenIn"
              fill
              sizes="50px"
              className="object-contain"
            />
          </div>
          <span className="text-[18px] font-extrabold leading-[27px] text-white">
            PanenIn
          </span>
        </div>

        <div className="rounded-full bg-[#c6dfc6] px-[9px] py-[5px]">
          <OnboardingProgress
            activeStep={activeStep}
            inactiveColor={paneninColors.neutral.ne00}
            activeColor={paneninColors.primary.pr30}
          />
        </div>
      </div>
    </header>
  );
}
