import "../styles/globals.css";

export const metadata = {
  title: "Eye Auth",
  description: "Iris authentication system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
