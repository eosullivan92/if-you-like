import { defineConfig } from 'vite'
import dns from 'dns'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), EnvironmentPlugin('all')],
})
