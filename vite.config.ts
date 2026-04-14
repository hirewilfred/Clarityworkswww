import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const isVercel = !!process.env.VERCEL;

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '.', '');

    const plugins: any[] = [react()];

    // Prerendering requires Puppeteer/Chrome — skip on Vercel (no browser available)
    if (!isVercel) {
      try {
        const { default: prerender } = await import('@prerenderer/rollup-plugin');
        plugins.push(
          prerender({
            routes: [
              '/', '/services', '/about', '/training',
              '/case-studies', '/agent-studio', '/ai-audit',
              '/cybersecurity', '/managed-it', '/ai-assessment', '/blog',
            ],
            renderer: '@prerenderer/renderer-puppeteer',
            rendererOptions: { renderAfterTime: 3000 },
          }),
        );
      } catch {
        // prerender plugin not installed — skip
      }
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins,
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
