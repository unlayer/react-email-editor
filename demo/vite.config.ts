import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The local wrapper dependency resolves React from the root node_modules.
    // Dedupe so the demo and wrapper share one copy.
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  server: {
    port: 3000,
  },
});
