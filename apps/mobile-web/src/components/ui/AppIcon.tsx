import Image from "next/image";

type AppIconProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

export function AppIcon({
  src,
  alt,
  size = 20,
  className = "",
}: AppIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
