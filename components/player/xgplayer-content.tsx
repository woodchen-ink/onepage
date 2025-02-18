'use client'

import { XGPlayer } from '@/components/ui/xg-player'
import { useSearchParams } from 'next/navigation'
import { VideoUrlInput } from './video-url-input'
import { NavBar } from '@/components/layout/nav-bar'
import { Suspense } from 'react'

function PlayerContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  if (!url) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <VideoUrlInput 
          title="XG播放器"
          description="西瓜视频开源播放器，支持 m3u8、mp4、flv 等多种格式"
        />
      </div>
    )
  }

  return (
    <>
      <style>{`
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        #xg-page {
          width: 100%;
          height: 100%;
          margin: auto;
          overflow: hidden;
          display: flex;
        }
        #xgplayer {
          flex: auto;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
      <div id="xg-page">
        <div id="xgplayer">
          <XGPlayer url={url} />
        </div>
      </div>
    </>
  )
}

export function XGPlayerContent() {
  return (
    <Suspense>
      <PlayerContent />
    </Suspense>
  )
} 