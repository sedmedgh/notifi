import { defineConfig } from 'vitepress'


export default defineConfig({
  base: '/notifi/',
  title: 'Notifi',
  description: 'Lightweight, flexible notifications',
  lang: 'en-US',
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', href: '/notifi/logo.svg' }],
    // SEO Meta Tags
    ['meta', { name: 'keywords', content: 'toast, notification, vue, javascript, typescript, lightweight, flexible, headless, ui library' }],
    ['meta', { name: 'author', content: 'sedmedgh' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Notifi - Headless Notification Library' }],
    ['meta', { property: 'og:description', content: 'Lightweight, flexible notifications for Vue.js applications' }],
    ['meta', { property: 'og:image', content: '/logo.svg' }],
    ['meta', { property: 'og:url', content: 'https://sedmedgh.github.io/notifi/' }],
    ['meta', { property: 'og:site_name', content: 'Notifi Documentation' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Notifi - Headless Notification Library' }],
    ['meta', { name: 'twitter:description', content: 'Lightweight, flexible notifications for Vue.js applications' }],
    ['meta', { name: 'twitter:image', content: '/logo.svg' }],
    
    // Additional SEO
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    
    // Canonical URL
    ['link', { rel: 'canonical', href: 'https://sedmedgh.github.io/notifi/' }],
    
    // Structured Data (JSON-LD)
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Notifi",
      "description": "Lightweight, flexible notifications for Vue.js applications",
      "url": "https://sedmedgh.github.io/notifi/",
      "author": {
        "@type": "Person",
        "name": "sedmedgh",
        "url": "https://github.com/sedmedgh"
      },
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "programmingLanguage": ["JavaScript", "TypeScript", "Vue.js"],
      "license": "MIT",
      "repository": "https://github.com/sedmedgh/notifi"
    })]
  ],
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


