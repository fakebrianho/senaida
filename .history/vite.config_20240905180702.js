import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import { resolve } from 'path'

// Define the Vite configuration
export default defineConfig({
	plugins: [
		glsl(), // Handle shader files
	],
	build: {
		rollupOptions: {
			input: {
				// main: './index.html',
				main: resolve(__dirname, 'index.html'),
				main: resolve(__dirname, 'index.html'),
				// page2: './page2.html',
				// Add more pages as needed
			},
		},
	},
})
