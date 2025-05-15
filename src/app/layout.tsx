import React from 'react';
import '../styles/globals.css';
import '../styles/App.module.css';

export const metadata = {
  title: 'OxWord',
  description: 'An Dictionary application with English-Turkish translations',
};

import ClientLayout from '../components/ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark-theme">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
