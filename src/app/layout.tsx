import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const display = Sora({
  variable: "--display",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Step-by-step computer tutorials — Windows, macOS, hardware, software, security, coding and AI. Plain-English guides you can actually follow.",
  keywords: [
    "how to",
    "tutorials",
    "windows tutorials",
    "macOS tips",
    "computer guides",
    "beginner coding",
    "security tips",
    "AI tools",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Computer Tutorials You Can Actually Follow`,
    description:
      "Step-by-step computer tutorials — Windows, macOS, hardware, software, security, coding and AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Computer Tutorials You Can Actually Follow`,
    description:
      "Step-by-step computer tutorials — Windows, macOS, hardware, software, security, coding and AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("aitech-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      className={`${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WXVKGBP4MD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WXVKGBP4MD');`}
        </Script>
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-fg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
