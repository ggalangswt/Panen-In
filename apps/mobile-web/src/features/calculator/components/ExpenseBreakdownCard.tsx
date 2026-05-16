type ExpenseItem = {
  label: string;
  value: string;
};

type ExpenseBreakdownCardProps = {
  items: ExpenseItem[];
  footerLabel?: string;
  footerValue?: string;
  onAddExpense?: () => void;
};

export function ExpenseBreakdownCard({
  items,
  footerLabel,
  footerValue,
  onAddExpense,
}: ExpenseBreakdownCardProps) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#e0e0de] bg-white">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between border-b border-[#e0e0de] px-[15px] py-[17px] text-[15px] font-medium leading-[22.5px] text-[#6b6b68] last:border-b-0"
        >
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}

      {onAddExpense ? (
        <button
          type="button"
          onClick={onAddExpense}
          className="flex w-full items-center justify-center gap-[5px] px-[15px] py-[17px] text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]"
        >
          <span className="text-[20px] leading-none">+</span>
          <span>Tambah Pengeluaran</span>
        </button>
      ) : null}

      {footerLabel && footerValue ? (
        <div className="flex items-center justify-between px-[15px] py-[17px] text-[15px] leading-[22.5px] text-[#2d6a2d]">
          <span className="font-bold">{footerLabel}</span>
          <span className="font-medium">{footerValue}</span>
        </div>
      ) : null}
    </div>
  );
}
