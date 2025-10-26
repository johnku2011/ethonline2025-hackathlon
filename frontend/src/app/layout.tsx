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
  title: 'Pay2Earn - Subscriptions That Pay You Back',
  description:
    'Pay yearly subscriptions in PyUSD, earn at least 4% APY from PyUSD rewards plus Morpho vault yields. Complete the year and withdraw your principal plus interest. Built on Arbitrum.',
  keywords: [
    'PyUSD',
    'Arbitrum',
    'Morpho',
    'subscription',
    'DeFi',
    'Web3',
    'crypto rewards',
    'Pay2Earn',
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
