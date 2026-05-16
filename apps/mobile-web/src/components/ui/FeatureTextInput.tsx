import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FeatureTextInputProps =
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>);

export function FeatureTextInput(props: FeatureTextInputProps) {
  const baseClassName =
    "w-full rounded-[10px] border border-[#e0e0de] bg-white px-[15px] py-[18px] text-[15px] font-medium leading-[22.5px] text-[#1a1a18] outline-none placeholder:text-[#6b6b68]";

  if (props.multiline) {
    const { className = "", multiline: _multiline, ...rest } = props;

    return (
      <textarea
        className={`${baseClassName} min-h-[96px] resize-none ${className}`.trim()}
        {...rest}
      />
    );
  }

  const { className = "", multiline: _multiline, ...rest } = props;

  return <input className={`${baseClassName} ${className}`.trim()} {...rest} />;
}
