import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "BlogSpace",
  description: "Read, write, and manage blogs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
