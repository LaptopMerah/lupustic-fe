import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ScanProvider } from "@/lib/ScanContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Lupustic — Early Lupus Detection, Powered by AI",
  description:
    "Upload a photo of your skin. Our computer vision model analyzes potential Lupus indicators in seconds. Get AI-powered consultation for early SLE detection.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <ScanProvider>
          <AuthProvider>
            <TooltipProvider>
              <SidebarProvider>
                <LayoutShell>{children}</LayoutShell>
              </SidebarProvider>
            </TooltipProvider>
          </AuthProvider>
        </ScanProvider>
      </body>
    </html>
  );
}
