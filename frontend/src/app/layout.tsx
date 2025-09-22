import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';

import AppHeader from '@/components/layout/app-header';
import ContextProvider from '@/context';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HyperUX',
  description: 'Composable trading surfaces for Hyperliquid',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const cookies = requestHeaders.get('cookie');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased`}
      >
        <ContextProvider cookies={cookies}>
          <AppHeader />
          <main className="min-h-[calc(100vh-72px)] bg-transparent pb-16 pt-6">{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
