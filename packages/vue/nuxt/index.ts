// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Vue SFC import (handled by Vite plugin)
// @ts-ignore -- Vue SFC import (handled by Vite plugin)
import { defineNuxtModule, addComponent, addPlugin, createResolver } from '@nuxt/kit'

interface ModuleOptions {
  css?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@notifi/vue',
    configKey: 'notifiVue',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    css: true,
  },
  setup(moduleOptions: any, nuxt: any) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'NotifContainer',
      export: 'NotifContainer',
      filePath: '@notifi/vue',
      mode: 'client',
    })

    addPlugin({
      src: resolve('./runtime'),
      mode: 'client',
    })

    if (moduleOptions.css) {
      nuxt.options.css.push('@notifi/core/style.css')
    }
  },
})
