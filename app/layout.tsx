import Header from "@/components/header";
import "./globals.css";
import Footer from "@/components/footer";
import { Providers } from "./providers";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
       <body className="antialiased ">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
