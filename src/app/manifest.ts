import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monsalve Formatações',
    short_name: 'Monsalve',
    description: 'Aprovação sem estresse. Seu trabalho na formatação ideal (ABNT, APA, Vancouver).',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCFAFF',
    theme_color: '#5B3196',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}