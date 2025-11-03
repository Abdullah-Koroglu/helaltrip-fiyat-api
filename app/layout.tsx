import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Otel Fiyat Sorgulama",
  description: "Halal Booking otel fiyatlarını anlık olarak sorgulayın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

