import type {Metadata} from 'next';
import { Oxanium, JetBrains_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Global styles

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'GRIS — Global Resource Intelligence System',
  description: 'The world\'s most advanced platform for visualization, analysis, and intelligence of natural resources, geology, and energy.',
  icons: {
    icon: '/logo-gris.png',
    shortcut: '/logo-gris.png',
    apple: '/logo-gris.png',
  },
  openGraph: {
    title: 'GRIS — Global Resource Intelligence System',
    description: 'Sistema tático de inteligência geoespacial.',
    images: [{ url: '/logo-gris.png' }],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${oxanium.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/cesium@1.140.0/Build/Cesium/Widgets/widgets.css" />
      </head>
      <body suppressHydrationWarning className="font-inter bg-[var(--gris-void)] text-[var(--gris-text-primary)] overflow-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
