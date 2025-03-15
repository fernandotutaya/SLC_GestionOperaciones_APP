import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import Components from 'unplugin-vue-components/rspack';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { join } from 'path';

export default defineConfig({
  plugins: [pluginVue()],
  source: {
    alias: {
      '@': join(__dirname, './src'),
    },
    // Inject environment variables into the client bundle
    define: {
      'process.env.VITE_BASE_API': JSON.stringify(process.env.VITE_BASE_API),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // Add more variables as needed
    },
  },
  tools: {
    rspack: {
      plugins: [
        Components({
          resolvers: [PrimeVueResolver()]
        })
      ]
    },
    // Correct PostCSS configuration
    postcss: (options, config) => {
      // If you're using a separate postcss.config.cjs file
      return {
        ...options,
        config: join(__dirname, 'postcss.config.cjs')
      };
    }
  },
});