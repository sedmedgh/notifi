import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { name } from './package.json'

const externalPackages = [
  'src/App.vue',
  '#app',
  'vue',
  /^@nuxt\/.*/,
  /^nuxt\/.*/,
  'csstype',
  '@notifi/core',
]

export default defineConfig({
  optimizeDeps: {
    exclude: ['src/App.vue', 'src/main.ts'],
  },
  plugins: [
    vue() as PluginOption,
    dts({
      entryRoot: 'src',
      cleanVueFileName: true,
      outDir: './dist',
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  resolve: {
    dedupe: externalPackages,
  },
  publicDir: false,
  server: {
    // Listening on all local IPs
    host: true,
    port: 3000,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', '../..'],
      strict: true,
    },
  },
  build: {
    assetsDir: '',
    cssCodeSplit: false,
    lib: {
      entry: {
        index: 'src/index.ts',
        nuxt: 'nuxt/index.ts',
      },
      name,
      fileName: (format, _name) => {
        const getFormat = format === 'es' ? 'js' : 'umd.cjs'
        if (_name === 'index') return `index.${getFormat}`
        return `${_name}/index.${getFormat}`
      },
    },
    rollupOptions: {
      external: externalPackages,
      output: {
        dir: 'dist',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            if (assetInfo.name === 'index.css') return 'style/index.css'
            return `[name]/index.css`
          }
          return 'assets/[name].[ext]'
        },
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
