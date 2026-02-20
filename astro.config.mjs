import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
integrations: [react()],
vite: {
envPrefix: ['PUBLIC_', 'VITE_'],
resolve: {
alias: {
'@': fileURLToPath(new URL('./app/src', import.meta.url)),
},
},
},
});
