import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for partscentral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        {children}

        <ToastContainer />
      </body>
    </html>
  );
}
