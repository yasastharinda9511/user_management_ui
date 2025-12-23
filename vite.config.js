import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 80,  // Set the port to 80 (or another port that fits your configuration)
        host: true,  // Allow access from external devices, necessary for cloud deployments
        strictPort: true,  // Ensure that the specified port is used (if it's taken, Vite will error out)
    },
})
