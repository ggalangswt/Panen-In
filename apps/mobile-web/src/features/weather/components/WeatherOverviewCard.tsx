import { WeatherTodayCard } from "@/features/home/components/WeatherTodayCard";

type WeatherOverviewCardProps = {
  temperature: string;
  condition: string;
  iconSrc: string;
  iconAlt: string;
  metrics: Array<{ iconSrc: string; iconAlt: string; value: string }>;
};

export function WeatherOverviewCard({
  temperature,
  condition,
  iconSrc,
  iconAlt,
  metrics,
}: WeatherOverviewCardProps) {
  return (
    <WeatherTodayCard
      temperature={temperature}
      condition={condition}
      iconSrc={iconSrc}
      iconAlt={iconAlt}
      metrics={metrics}
    />
  );
}
