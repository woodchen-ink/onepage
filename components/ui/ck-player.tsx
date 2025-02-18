'use client'

import { useEffect, useRef } from 'react'

interface CKPlayerProps {
  url: string
  className?: string
}

interface CKPlayerConfig {
  container: string | HTMLElement
  volume?: number
  autoplay?: boolean
  loop?: boolean
  rightBar?: boolean
  plug?: string
  live?: boolean
  controls?: boolean
  seek?: string
  cookie?: string
  domain?: string
  crossOrigin?: string
  barHideTime?: number
  playbackrateOpen?: boolean
  playbackrateList?: number[]
  mouseWheelVolume?: number
  keyVolume?: number
  menu?: Array<{
    title: string
    link?: string
    underline?: boolean
    click?: string
  }>
  information?: Record<string, string>
  video: string
}

declare global {
  interface Window {
    ckplayer: {
      new (config: CKPlayerConfig): CKPlayerInstance
    }
  }
}

interface CKPlayerInstance {
  destroy(): void
  pause(): void
  play(): void
  volume(value: number): void
  time(value: number): void
  muted(value: boolean): void
  ended: boolean
  duration: number
  currentTime: number
}

export function CKPlayer({ url: encodedUrl, className }: CKPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playerRef.current) return

    const url = decodeURIComponent(encodedUrl)
    const urlhz = url.split('.').pop()?.toLowerCase()
    const cookieName = btoa(url)

    let plug = 'normal'
    if (urlhz === 'm3u8') {
      plug = 'hls.js'
    } else if (urlhz === 'flv') {
      plug = 'flv.js'
    } else if (urlhz === 'ts') {
      plug = 'mpegts.js'
    } else if (urlhz === 'mp4') {
      plug = ''
    } else {
      plug = ''
    }

    // 加载所需的脚本
    const scripts = [
      'https://i-cf.czl.net/jsdelivr/npm/sq888-ckplayer@1.0.0/js/ckplayer.min.js',
      'https://i-cf.czl.net/cdnjs/ajax/libs/flv.js/1.6.2/flv.min.js',
      'https://i-cf.czl.net/cdnjs/ajax/libs/hls.js/1.5.17/hls.min.js',
      'https://i-cf.czl.net/jsdelivr/npm/sq888-ckplayer@1.0.0/mpegts.js/mpegts.min.js',
    ]

    // 加载 CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://i-cf.czl.net/jsdelivr/npm/sq888-ckplayer@1.0.0/css/ckplayer.ixigua.css'
    document.head.appendChild(link)

    // 加载所有脚本
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
      if (!playerRef.current) return

      const videoConfig: CKPlayerConfig = {
        container: playerRef.current,
        volume: 1,
        autoplay: true,
        loop: false,
        rightBar: true,
        plug,
        live: false,
        controls: false,
        seek: 'cookie',
        cookie: cookieName,
        domain: 'onepage.czl.net',
        crossOrigin: 'Anonymous',
        barHideTime: 1500,
        playbackrateOpen: true,
        playbackrateList: [0.5, 0.75, 1, 1.25, 1.5, 2],
        mouseWheelVolume: 1,
        keyVolume: 1,
        menu: [
          {
            title: 'ckplayer',
            link: 'https://freedvd.cc',
          },
          {
            title: 'version:X3',
            underline: true,
          },
          {
            title: '关于视频',
            click: 'aboutShow',
          },
        ],
        information: {
          '视频加载：': '{loadTime}秒',
          '视频时长：': '{duration}秒',
          '视频尺寸：': '{videoWidth}x{videoHeight}',
          '视频音量：': '{volume}%',
          '视频FPS：': '{fps}',
          '音频解码：': '{audioDecodedByteCount} Byte',
          '视频解码：': '{videoDecodedByteCount} Byte',
        },
        video: url,
      }

      new window.ckplayer(videoConfig)
    })

    return () => {
      // 清理脚本和样式
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`)
        if (script) {
          document.head.removeChild(script)
        }
      })
      document.head.removeChild(link)
    }
  }, [encodedUrl])

  return <div ref={playerRef} className={className} style={{ width: '100%', height: '100%' }} />
} 