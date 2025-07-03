import "./globals.css";
import Providers from "./Providers";
import NavBar from "../components/NavBar";
// ...other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}