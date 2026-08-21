import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/app/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Increase warning threshold (we split manually so large chunks are expected)
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // PDF & image generation — only loaded when CertificateModal opens
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image')) {
              return 'vendor-pdf';
            }
            // Recharts — only loaded when Radar/Analytics tab is opened
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-recharts';
            }
            // Framer Motion animation library
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion/')) {
              return 'vendor-motion';
            }
            // React core — very small, always needed
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
              return 'vendor-react';
            }
          },
        },
      },
    },
  };
});
