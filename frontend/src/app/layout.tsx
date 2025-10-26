import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ClientLayout } from '@/components/layout/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PyUSD Subscription Platform - Earn While You Subscribe',
  description:
    'A decentralized subscription platform where users earn 4.5% APY on yearly subscriptions. Complete the year, get rewarded. Built on Arbitrum with PyUSD.',
  keywords: [
    'PyUSD',
    'Arbitrum',
    'subscription',
    'DeFi',
    'Web3',
    'crypto rewards',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
