import Image from "next/image";

type WeatherMetric = {
  iconSrc: string;
  iconAlt: string;
  value: string;
};

type WeatherTodayCardProps = {
  temperature: string;
  condition: string;
  iconSrc: string;
  iconAlt: string;
  metrics: WeatherMetric[];
};

export function WeatherTodayCard({
  temperature,
  condition,
  iconSrc,
  iconAlt,
  metrics,
}: WeatherTodayCardProps) {
  return (
    <article className="rounded-[10px] border border-[#e0e0de] bg-white p-5">
      <div className="flex flex-col gap-[35px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-[10px]">
            <h3 className="text-[26px] font-medium leading-[39px] text-[#1a1a18]">
              {temperature}
            </h3>
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          </div>
          <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
            {condition}
          </p>
        </div>

        <div className="flex gap-[10px]">
          {metrics.map((metric) => (
            <div
              key={`${metric.iconSrc}-${metric.value}`}
              className="flex items-center gap-[5px] rounded-full border border-[#6b6b68] bg-[#f7f7f5] px-5 py-[5px]"
            >
              <Image
                src={metric.iconSrc}
                alt={metric.iconAlt}
                width={18}
                height={18}
                className="size-[18px] object-contain"
              />
              <span className="text-[12px] font-normal leading-[18px] text-[#6b6b68]">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
