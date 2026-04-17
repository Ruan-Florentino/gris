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

export const metadata: Metadata = {
  title: 'GRIS — Global Resource Intelligence System',
  description: 'The world\'s most advanced platform for visualization, analysis, and intelligence of natural resources, geology, and energy.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${oxanium.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/cesium@1.140.0/Build/Cesium/Widgets/widgets.css" />
      </head>
      <body suppressHydrationWarning className="font-inter bg-[var(--gris-void)] text-[var(--gris-text-primary)] overflow-hidden">
        <Script 
          src="https://unpkg.com/cesium@1.140.0/Build/Cesium/Cesium.js" 
          strategy="beforeInteractive" 
        />
        <Script id="cesium-base-url" strategy="beforeInteractive">
          {`window.CESIUM_BASE_URL = 'https://unpkg.com/cesium@1.140.0/Build/Cesium/';`}
        </Script>
        {children}
      </body>
    </html>
  );
}
