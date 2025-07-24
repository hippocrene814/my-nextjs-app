import "./globals.css";
import Providers from "./Providers";
import NavBar from "../components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

// export const metadata = {
//   title: "MM Passport",
//   description: "description",
//   icons: {
//     icon: "/brand-logo.png",
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>
//           <NavBar />
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }