import type { Metadata } from "next";
import { Albert_Sans, Geist } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/Auth/SessionProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import OnboardingWizard from "@/components/Common/OnboardingWizard";

// Body copy. The reference sets body text at weight 500, so 500 ships.
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

// Display face for headings, used at weight 400 — see --font-display.
const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-albert",
});

export const metadata: Metadata = {
  title: "SafeMeds - Healthcare Management Platform",
  description:
    "Secure healthcare management platform with role-based access for clients and pharmacies",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> so :root can resolve --font-display; on
    // <body> they would be out of scope for the :root token that uses them.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${albert.variable}`}
    >
      <body className={`${geist.className} antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <NotificationProvider>
              <OnboardingProvider>
                {/* Back navigation and the theme toggle now live in the app
                    chrome (PageHeader / SideNav) rather than floating over
                    every page, where they collided with the bottom nav. */}
                {children}
                <OnboardingWizard />
              </OnboardingProvider>
            </NotificationProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
