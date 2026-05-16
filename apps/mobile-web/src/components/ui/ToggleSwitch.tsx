"use client";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
};

export function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`flex h-[31px] w-[66px] items-center rounded-full p-[2px] transition-colors ${
        checked ? "justify-end bg-[#2d6a2d]" : "justify-start bg-[#f7f7f5]"
      }`}
    >
      <span className="block size-[25px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]" />
    </button>
  );
}
