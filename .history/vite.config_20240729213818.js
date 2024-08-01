import glsl from 'vite-plugin-glsl'

export default {
	plugins: [
		restart({ restart: ['../static/**'] }), // Restart server on static file change
		glsl(), // Handle shader files
	],
}
