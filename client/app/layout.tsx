import './globals.module.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EdTech Platform',
  description: 'EdTech Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        

        <AuthProvider>
          <EnrollmentProvider>
            <Header />
            {children}</EnrollmentProvider>
            <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
