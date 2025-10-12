'use client'

import { useEffect } from 'react'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Title
    document.title = 'QR Меню - Каталог ресторанов'

    // Viewport
  if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta')
      viewport.name = 'viewport'
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      document.head.appendChild(viewport)
    }

    // Theme color
  let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (!themeMeta) {
      themeMeta = document.createElement('meta')
      themeMeta.name = 'theme-color'
      document.head.appendChild(themeMeta)
    }
    themeMeta!.content = '#000000'

    // Apple web app capable
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const apple = document.createElement('meta')
      apple.name = 'apple-mobile-web-app-capable'
      apple.content = 'yes'
      document.head.appendChild(apple)
    }

    // SW registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      ;(window as any).deferredPrompt = e
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any)

    const handleAppInstalled = () => {
      // no-op; keeping as hook point
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return <>{children}</>
}
