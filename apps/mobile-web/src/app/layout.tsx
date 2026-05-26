import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://panenin.vercel.app"),
  applicationName: "PanenIn",
  title: {
    default: "PanenIn",
    template: "%s | PanenIn",
  },
  description:
    "Asisten tani digital untuk petani Indonesia: cuaca harian, kalkulator usaha tani, catatan panen, dan konsultasi AI.",
  keywords: [
    "PanenIn",
    "petani Indonesia",
    "pertanian",
    "cuaca pertanian",
    "kalkulator usaha tani",
    "catatan panen",
    "konsultasi AI",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/panenin-logo.png", type: "image/png" }],
    apple: [{ url: "/panenin-logo.png", type: "image/png" }],
    shortcut: ["/panenin-logo.png"],
  },
  openGraph: {
    title: "PanenIn",
    description:
      "Asisten tani digital untuk petani Indonesia: cuaca harian, kalkulator usaha tani, catatan panen, dan konsultasi AI.",
    type: "website",
    locale: "id_ID",
    siteName: "PanenIn",
    images: [
      {
        url: "/panenin-logo.png",
        alt: "Logo aplikasi PanenIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PanenIn",
    description:
      "Asisten tani digital untuk petani Indonesia: cuaca harian, kalkulator usaha tani, catatan panen, dan konsultasi AI.",
    images: ["/panenin-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2d6a2d",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body className={plusJakartaSans.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
