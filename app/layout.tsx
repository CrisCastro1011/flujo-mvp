import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppLayout from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finely - Personal Finance',
  description: 'Track your income, expenses, budgets, and savings goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
