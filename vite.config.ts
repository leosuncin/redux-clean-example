import { resolve } from 'path';
import { defineConfig } from 'vite';
import mix from 'vite-plugin-mix';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mix({
      handler: './handler.ts',
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        counter: resolve(__dirname, 'counter.html'),
      },
    },
  },
});
