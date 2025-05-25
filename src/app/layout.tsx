import React from 'react';
import '../styles/globals.css';
import '../styles/App.module.css';
import ClientLayout from '../components/ClientLayout';


export const metadata = {
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
      <body className="dark-theme">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
