'use client'

import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  url: string
  className?: string
}

interface DPlayerInstance {
  seek(time: number): void
  destroy(): void
  video: {
    currentTime: number
    paused: boolean
  }
  on(event: string, callback: () => void): void
}

type PreloadType = 'none' | 'metadata' | 'auto'

interface VideoSource {
  video?: {
    url: string
    type?: string
  }
  url?: string
}

interface DPlayerOptions {
  container: HTMLElement
  autoplay?: boolean
  screenshot?: boolean
  preload?: PreloadType
  live?: boolean
  theme?: string
  chromecast?: boolean
  hotkey?: boolean
  airplay?: boolean
  volume?: number
  playbackSpeed?: number[]
  video: {
    url: string
    type?: string
    customType?: {
      [key: string]: (video: HTMLVideoElement, src: unknown) => void
    }
  }
}

export function VideoPlayer({ url: encodedUrl, className }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const dPlayerRef = useRef<DPlayerInstance | null>(null)

  useEffect(() => {
    if (!playerRef.current) return

    let cleanup: (() => void) | undefined
    const url = decodeURIComponent(encodedUrl)

    // 动态导入所有需要的播放器
    Promise.all([
      import('dplayer'),
      import('hls.js'),
      import('flv.js'),
      import('dashjs'),
    ]).then(([DPlayer, Hls, Flv, Dash]) => {
      if (!playerRef.current) return

      let type = 'normal'
      const customType: DPlayerOptions['video']['customType'] = {}

      if (url.includes('.m3u8')) {
        type = 'customHls'
        customType[type] = function(video: HTMLVideoElement, src: unknown) {
          const videoUrl = typeof src === 'object' && src !== null 
            ? ((src as VideoSource).video?.url || (src as VideoSource).url || url) 
            : String(src)
          const hls = new Hls.default({
            xhrSetup: function(xhr) {
              xhr.withCredentials = false
            }
          })
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
          cleanup = () => {
            hls.destroy()
          }
        }
      } else if (url.includes('.flv')) {
        type = 'customFlv'
        customType[type] = function(video: HTMLVideoElement, src: unknown) {
          const videoUrl = typeof src === 'object' && src !== null 
            ? ((src as VideoSource).video?.url || (src as VideoSource).url || url) 
            : String(src)
          const flvPlayer = Flv.default.createPlayer({
            type: 'flv',
            url: videoUrl
          })
          flvPlayer.attachMediaElement(video)
          flvPlayer.load()
          cleanup = () => {
            flvPlayer.destroy()
          }
        }
      } else if (url.includes('.mpd')) {
        type = 'customDash'
        customType[type] = function(video: HTMLVideoElement, src: unknown) {
          const videoUrl = typeof src === 'object' && src !== null 
            ? ((src as VideoSource).video?.url || (src as VideoSource).url || url) 
            : String(src)
          const dashPlayer = Dash.MediaPlayer().create()
          dashPlayer.initialize(video, videoUrl, true)
          cleanup = () => {
            dashPlayer.destroy()
          }
        }
      }

      const options: DPlayerOptions = {
        container: playerRef.current,
        autoplay: true,
        screenshot: true,
        preload: 'metadata',
        live: false,
        theme: '#2EA7E0',
        chromecast: true,
        hotkey: true,
        airplay: true,
        volume: 0.7,
        playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
        video: {
          url,
          type,
          customType,
        },
      }

      const player = new DPlayer.default(options)
      dPlayerRef.current = player

      // 加载保存的进度
      const videoProgressKey = url
      const videoProgress = JSON.parse(localStorage.getItem(videoProgressKey) || '{}')

      // @ts-expect-error - DPlayer 类型定义不完整
      player.on('loadeddata', () => {
        if (
          videoProgress.timestamp &&
          Date.now() - videoProgress.timestamp < 2592000000
        ) {
          player.seek(videoProgress.currentTime)
        }
      })

      // 每5秒保存进度
      const progressSaveTimer = setInterval(() => {
        if (player && !player.video.paused) {
          localStorage.setItem(
            videoProgressKey,
            JSON.stringify({
              currentTime: player.video.currentTime,
              timestamp: Date.now(),
            })
          )
        }
      }, 5000)

      const originalCleanup = cleanup
      cleanup = () => {
        clearInterval(progressSaveTimer)
        player.destroy()
        if (originalCleanup) {
          originalCleanup()
        }
      }
    })

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [encodedUrl])

  return <div ref={playerRef} className={className} />
} 