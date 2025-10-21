import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@/components/providers/PrivyProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OPN Hub - IOPn Ecosystem Gateway",
  description: "Your gateway to the Internet of People ecosystem",
  icons: {
    icon: '/iopn.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <PrivyProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </PrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}