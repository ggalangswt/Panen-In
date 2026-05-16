type SectionTitleProps = {
  children: string;
  bold?: boolean;
};

export function SectionTitle({ children, bold = false }: SectionTitleProps) {
  return (
    <p
      className={`text-[15px] leading-[22.5px] text-[#6b6b68] ${
        bold ? "font-bold" : "font-medium"
      }`}
    >
      {children}
    </p>
  );
}
