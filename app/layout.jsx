import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";

export const metadata = {
  title: "Simple Shop",
  description: "A small Next.js add-to-cart example",
};

// This layout wraps every page in the app.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <Header />
          <main className="container">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
