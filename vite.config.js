import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@comp': fileURLToPath(new URL('./src/shared/components', import.meta.url)),
			'@errors': fileURLToPath(new URL('./src/shared/store/errors', import.meta.url)),
			'@request': fileURLToPath(new URL('./src/services/http', import.meta.url)),
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		port: 8080,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			}
		}
	},
})
