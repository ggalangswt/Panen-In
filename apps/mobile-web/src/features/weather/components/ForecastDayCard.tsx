import Image from "next/image";

type ForecastDayCardProps = {
  day: string;
  temp: string;
  iconSrc: string;
  iconAlt: string;
  selected?: boolean;
  onClick?: () => void;
};

export function ForecastDayCard({
  day,
  temp,
  iconSrc,
  iconAlt,
  selected = false,
  onClick,
}: ForecastDayCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[67px] flex-1 flex-col items-center justify-center gap-[5px] rounded-[10px] border px-[14px] py-3 ${
        selected
          ? "border-[#c6dfc6] bg-[#ebf5eb]"
          : "border-[#e0e0de] bg-white"
      }`}
    >
      <span
        className={`text-[12px] font-normal leading-[18px] ${
          selected ? "text-[#2d6a2d]" : "text-[#6b6b68]"
        }`}
      >
        {day}
      </span>
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={30}
        height={30}
        className="size-[30px] object-contain"
      />
      <span
        className={`text-[12px] font-medium leading-[18px] ${
          selected ? "text-[#2d6a2d]" : "text-[#3d3d3a]"
        }`}
      >
        {temp}
      </span>
    </button>
  );
}
