import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Tienda del cliente",
    template: "%s | Tienda del cliente",
  },
  description: "Catálogo y venta online de productos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
