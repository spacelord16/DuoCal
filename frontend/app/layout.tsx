// File: frontend/app/layout.tsx

import "./globals.css"; // This line imports the Tailwind CSS styles

export const metadata = {
  title: "DuoCal",
  description: "Stay healthy, together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
