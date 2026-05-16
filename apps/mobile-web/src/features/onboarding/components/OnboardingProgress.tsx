import { paneninColors } from "@panenin/ui";

type OnboardingProgressProps = {
  activeStep: number;
  totalSteps?: number;
  inactiveColor?: string;
  activeColor?: string;
};

export function OnboardingProgress({
  activeStep,
  totalSteps = 4,
  inactiveColor = paneninColors.neutral.ne20,
  activeColor = paneninColors.primary.pr30,
}: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          className="block size-[10px] rounded-full"
          style={{
            backgroundColor: index === activeStep ? activeColor : inactiveColor,
          }}
        />
      ))}
    </div>
  );
}
