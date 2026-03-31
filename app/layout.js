import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata = {
  title: "Carteira Digital",
  description: "Sua carteira financeira digital",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
