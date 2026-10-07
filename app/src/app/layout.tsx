import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Corner | POS Kiosk",
  description: "Choose your campus favorites and build your order with our touchscreen kiosk.",
  icons: { icon: "/campus-icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full font-sans antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
