'use client'

import { useEffect, useRef } from 'react'

interface AliPlayerProps {
  url: string
  className?: string
}

interface AliPlayerInstance {
  dispose(): void
  seek(time: number): void
  getCurrentTime(): number
  getStatus(): string
}

interface AliPlayerConfig {
  id: string
  source: string
  width: string
  height: string
  autoplay: boolean
  isLive: boolean
  rePlay: boolean
  playsinline: boolean
  preload: boolean
  controlBarVisibility: string
  useH5Prism: boolean
  format?: string
}

declare global {
  interface Window {
    Aliplayer: new (config: AliPlayerConfig, callback?: (player: AliPlayerInstance) => void) => AliPlayerInstance
  }
}

export function AliPlayer({ url: encodedUrl, className }: AliPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const aliPlayerRef = useRef<AliPlayerInstance | null>(null)

  useEffect(() => {
    if (!playerRef.current) return

    const url = decodeURIComponent(encodedUrl)
    let format = undefined

    if (url.includes('.m3u8')) {
      format = 'm3u8'
    } else if (url.includes('.flv')) {
      format = 'flv'
    } else if (url.includes('.mp4')) {
      format = 'mp4'
    }

    // 确保 Aliplayer 脚本已加载
    const script = document.createElement('script')
    script.src = '//g.alicdn.com/de/prismplayer/2.15.6/aliplayer-min.js'
    script.async = true

    script.onload = () => {
      if (!playerRef.current) return

      aliPlayerRef.current = new window.Aliplayer({
        id: playerRef.current.id,
        source: url,
        width: '100%',
        height: '100%',
        autoplay: true,
        isLive: false,
        rePlay: false,
        playsinline: true,
        preload: true,
        controlBarVisibility: 'hover',
        useH5Prism: true,
        format,
      }, () => {
        console.log('播放器创建成功')
      })
    }

    document.head.appendChild(script)

    // 加载 CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '//g.alicdn.com/de/prismplayer/2.15.6/skins/default/aliplayer-min.css'
    document.head.appendChild(link)

    // 保存播放进度
    const videoProgressKey = `ali_${url}`
    const savedProgress = localStorage.getItem(videoProgressKey)
    if (savedProgress) {
      const { currentTime, timestamp } = JSON.parse(savedProgress)
      if (Date.now() - timestamp < 2592000000) { // 30天内的进度有效
        const checkReady = setInterval(() => {
          if (aliPlayerRef.current?.getCurrentTime) {
            clearInterval(checkReady)
            aliPlayerRef.current.seek(currentTime)
          }
        }, 100)
      }
    }

    // 每5秒保存进度
    const progressSaveTimer = setInterval(() => {
      if (aliPlayerRef.current?.getCurrentTime && !aliPlayerRef.current.getStatus().includes('pause')) {
        localStorage.setItem(
          videoProgressKey,
          JSON.stringify({
            currentTime: aliPlayerRef.current.getCurrentTime(),
            timestamp: Date.now(),
          })
        )
      }
    }, 5000)

    return () => {
      if (aliPlayerRef.current) {
        aliPlayerRef.current.dispose()
      }
      document.head.removeChild(script)
      document.head.removeChild(link)
      clearInterval(progressSaveTimer)
    }
  }, [encodedUrl])

  return <div ref={playerRef} className={className} id="ali-player" />
} 