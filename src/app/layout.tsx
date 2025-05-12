import '@fontsource/roboto';
import '../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OxWord',
  description: 'An Dictionary application with English-Turkish translations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
