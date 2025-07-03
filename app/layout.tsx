import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { InstallPrompt } from '@/components/install-prompt';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MessHub - Kitchen Management Platform',
  description: 'Efficient kitchen and mess management system',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MessHub',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'MessHub',
  generator: 'Next.js',
  keywords: ['mess management', 'kitchen management', 'food service', 'PWA'],
  authors: [{ name: 'MessHub Team' }],
  creator: 'MessHub Team',
  publisher: 'MessHub',
  robots: 'index, follow',
  metadataBase: new URL('https://MessHub.vercel.app'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="background-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-title" content="MessHub" />
        <link rel="mask-icon" href="/icon-512x512.png" color="#ffffff" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <InstallPrompt />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}