import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PanenIn",
    short_name: "PanenIn",
    description:
      "Asisten tani digital untuk petani Indonesia: cuaca, kalkulator usaha tani, catatan panen, dan konsultasi AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#2d6a2d",
    lang: "id-ID",
    icons: [
      {
        src: "/panenin-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
