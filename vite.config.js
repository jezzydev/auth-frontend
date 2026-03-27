import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    // Load environment variables based on the current mode and cwd
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: mode === 'production' ? '/auth-frontend/' : '/',
        server: {
            proxy: {
                // Proxy requests starting with '/api'
                '/api': {
                    target: 'http://localhost:8000',
                    changeOrigin: true, // Optional: changes the origin of the host header to the target URL
                    // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrites the path (e.g., /api/users becomes /users)
                },
            },
        },
        appType: 'mpa', //spa for single page app (fallback to index.html), mpa for multipage (mimic real static server), custom if not including any html middlewares (eg server-side rendering)
    };
});
