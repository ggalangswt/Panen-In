type CarouselDotsProps = {
  activeIndex: number;
  total: number;
};

export function CarouselDots({ activeIndex, total }: CarouselDotsProps) {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`block size-[10px] rounded-full ${
            index === activeIndex ? "bg-[#2d6a2d]" : "bg-[#d9d9d9]"
          }`}
        />
      ))}
    </div>
  );
}
