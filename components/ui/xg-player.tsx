'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const NoSSR = dynamic(() => Promise.resolve((props: { children: React.ReactNode }) => <>{props.children}</>), {
  ssr: false
})

interface XGPlayerProps {
  url: string
  className?: string
  style?: React.CSSProperties
}

interface XGPlayerInstance {
  destroy(): void
  currentTime: number
  paused: boolean
}

function XGPlayerInner({ url }: XGPlayerProps) {
  const playerRef = useRef<XGPlayerInstance | null>(null)

  useEffect(() => {
    const videoProgressKey = `videoProgress_${url}`

    // 加载存储的进度
    const videoProgress = JSON.parse(localStorage.getItem(videoProgressKey) || '{}')
    const startTime = videoProgress.timestamp && (Date.now() - videoProgress.timestamp < 2592000000)
      ? videoProgress.currentTime
      : 0

    // 加载 CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.byted-static.com/xgplayer/3.0.20/dist/index.min.css'
    document.head.appendChild(link)

    // 加载所需的脚本
    const scripts = [
      'https://unpkg.byted-static.com/xgplayer/3.0.20/dist/index.min.js',
      'https://unpkg.byted-static.com/xgplayer-hls/3.0.20/dist/index.min.js',
      'https://unpkg.byted-static.com/xgplayer-flv/3.0.20/dist/index.min.js'
    ]

    Promise.all(
      scripts.map((src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = src
          script.async = true
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      })
    ).then(() => {
      // @ts-expect-error xxx
      const player = new window.Player({
        id: 'xgplayer',
        url,
        autoplay: true,
        volume: 1,
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
        pip: true,
        airplay: true,
        inactive: 5000,
        startTime,
        errorTips: `请<span>切换其他播放线路</span>试试`,
        enableVideoDbltouch: true,
        playsinline: true,
        leavePlayerTime: 5,
        cssFullscreen: false,
        fullscreen: true,
        rotate: true,
        videoAttributes: {
          crossOrigin: 'anonymous'
        },
        plugins: url.includes('.m3u8') 
          // @ts-expect-error xxx
          ? [window.HlsPlayer] 
          : url.includes('.flv') 
          // @ts-expect-error xxx
            ? [window.FlvPlayer] 
            : []
      })

      playerRef.current = player

      // 每2秒保存进度
      const progressSaveTimer = setInterval(() => {
        if (player && !player.paused) {
          localStorage.setItem(
            videoProgressKey,
            JSON.stringify({
              currentTime: player.currentTime,
              timestamp: Date.now()
            })
          )
        }
      }, 2000)

      return () => {
        clearInterval(progressSaveTimer)
        if (player) {
          player.destroy()
        }
        // 清理脚本和样式
        scripts.forEach((src) => {
          const script = document.querySelector(`script[src="${src}"]`)
          if (script) {
            document.head.removeChild(script)
          }
        })
        document.head.removeChild(link)
      }
    })
  }, [url])

  return null
}

export function XGPlayer(props: XGPlayerProps) {
  return (
    <NoSSR>
      <XGPlayerInner {...props} />
    </NoSSR>
  )
} 