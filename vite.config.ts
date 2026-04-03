import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from '@prerenderer/rollup-plugin';

const publicRoutes = [
  '/',
  '/services',
  '/about',
  '/pricing',
  '/training',
  '/case-studies',
  '/agent-studio',
  '/ai-audit',
  '/cybersecurity',
  '/managed-it',
  '/ai-assessment',
  '/blog',
];

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        prerender({
          routes: publicRoutes,
          renderer: '@prerenderer/renderer-puppeteer',
          rendererOptions: {
            renderAfterTime: 3000,
          },
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
