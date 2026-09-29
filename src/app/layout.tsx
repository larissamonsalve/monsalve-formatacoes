// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import RegisterSW from '@/components/RegisterSW';

export const metadata: Metadata = {
  title: 'Monsalve Formatações | Consultoria & Revisão Acadêmica',
  description: 'Formatamos seu TCC, artigo ou dissertação seguindo estritamente as normas ABNT, APA e Vancouver.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#5B3196',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}