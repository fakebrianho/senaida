import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

// Define the Vite configuration
export default defineConfig({
	plugins: [
		glsl(), // Handle shader files
	],
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				page2: './page2.html',
				// Add more pages as needed
			},
		},
	},
})
