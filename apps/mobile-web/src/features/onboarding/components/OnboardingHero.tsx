type OnboardingHeroProps = {
  imageUrl: string;
  alt: string;
  heightClassName?: string;
};

export function OnboardingHero({
  imageUrl,
  alt,
  heightClassName = "h-[320px] w-[350px]",
}: OnboardingHeroProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${heightClassName} rounded-[20px] bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}
