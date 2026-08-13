import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://facile.example.com"),
  title: {
    default: "Facile — Your all-in-one link, on a tap",
    template: "%s · Facile",
  },
  description:
    "Facile is the NFC smart card that turns one tap into your entire profile. Share your links, socials, and contact in a second — no app required.",
  openGraph: {
    title: "Facile — Your all-in-one link, on a tap",
    description:
      "The NFC smart card that turns one tap into your entire profile.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
