import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Notifi',
  description: 'Lightweight, flexible notifications',
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Vue', link: '/vue' },
      { text: 'Example', link: '/example' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sedmedgh/notifi' }
    ]
  }
})


