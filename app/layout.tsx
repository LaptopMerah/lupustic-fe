import type { Metadata } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import { SidebarProvider } from "@/components/layout/SidebarProvider"
import { LayoutShell } from "@/components/layout/LayoutShell"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/hooks/useAuth"
import { ScanProvider } from "@/lib/ScanContext"
import { Toaster } from "sonner"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Lupustic — Early Lupus Detection, Powered by AI",
  description:
    "Upload a photo of your skin. Our computer vision model analyzes potential Lupus indicators in seconds. Get AI-powered consultation for early SLE detection.",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages()
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ScanProvider>
            <AuthProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <LayoutShell>{children}</LayoutShell>
                </SidebarProvider>
              </TooltipProvider>
            </AuthProvider>
          </ScanProvider>
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
