'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import HlsPlugin from 'xgplayer-hls'
import FlvPlugin from 'xgplayer-flv'
import Mp4Plugin from "xgplayer-mp4"

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
    const player = url.includes('.m3u8')
      ? (typeof document !== 'undefined' && document.createElement('video').canPlayType('application/vnd.apple.mpegurl'))
        ? new Player({
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
            }
          })
        : new Player({
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
            plugins: [HlsPlugin]
          })
      : url.includes('.flv')
        ? new Player({
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
            plugins: [FlvPlugin]
          })
        : url.includes('.mp4')
          ? new Player({
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
              plugins: [Mp4Plugin]
            })
          : new Player({
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
              }
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
    }
  })


  return null
}

export function XGPlayer(props: XGPlayerProps) {
  return (
    <NoSSR>
      <XGPlayerInner {...props} />
    </NoSSR>
  )
}