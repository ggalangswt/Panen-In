"use client";

type AuthInputFieldProps = {
  icon?: "email" | "password";
  placeholder: string;
  type?: "text" | "email" | "password";
  value?: string;
  onChange?: (value: string) => void;
};

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5 shrink-0 text-[#1a1a18]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
      <path d="m4.5 6 5.5 4 5.5-4" />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5 shrink-0 text-[#1a1a18]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="8.5" width="11" height="8" rx="1.5" />
      <path d="M7 8.5V6.8A3 3 0 0 1 10 4a3 3 0 0 1 3 2.8v1.7" />
      <circle cx="10" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AuthInputField({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: AuthInputFieldProps) {
  return (
    <label className="flex h-[49px] w-full items-center rounded-[10px] border border-[#6b6b68] bg-transparent px-2.5 py-[14px]">
      <div className="flex w-full items-center gap-2.5">
        {icon === "email" ? <EmailIcon /> : null}
        {icon === "password" ? <PasswordIcon /> : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[12px] font-normal leading-[18px] text-[#1a1a18] placeholder:text-[#6b6b68] outline-none"
        />
      </div>
    </label>
  );
}
