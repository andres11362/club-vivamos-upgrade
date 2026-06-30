import type { Metadata } from "next";
import localFont from "next/font/local";
import GTMRouteTracker from "@/components/Analytics/GTMRouteTracker";
import "./globals.css";
import { Providers } from "@/providers";
import Header from "@/components/molecules/header";
import Footer from "@/components/molecules/footer";

// 1. Configurar familia con múltiples pesos (Barlow Condensed)
const barlowCondensed = localFont({
  src: [
    {
      path: "./fonts/BarlowCondensed/BarlowCondensed-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/BarlowCondensed/BarlowCondensed-Medium.woff2", // Prefiere siempre woff2
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/BarlowCondensed/BarlowCondensed-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-barlow-cond", // Nombre de la variable CSS
  display: "swap",
});

// 2. Configurar otra familia (Maven Pro)
const mavenPro = localFont({
  src: [
    {
      path: "./fonts/MavenPro/MavenPro-Regular.woff", // Usa el formato más moderno que tengas ahí
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MavenPro/MavenPro-Medium.woff", // peso 500: nav, footer, migas (uso intensivo en legacy)
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/MavenPro/MavenPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-maven-pro",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: confirmar copy SEO definitivo (title/description) contra el sitio en producción
  title: "Club Vivamos",
  description: "Club Vivamos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${mavenPro.variable}`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-36x36.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/android-icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/apple-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon.ico/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicon.ico/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon.ico/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon.ico/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon.ico/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon.ico/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon.ico/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicon.ico/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon.ico/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.ico/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.ico/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon.ico/favicon-96x96.png"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <GTMRouteTracker />
          <Header />
            {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
