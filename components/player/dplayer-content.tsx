'use client'

import { VideoPlayer } from '@/components/ui/d-player'
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
          title="DPlayer 播放器"
          description="支持弹幕的 HTML5 视频播放器，支持 m3u8、mp4 等格式"
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer url={url} className="h-full w-full" />
    </div>
  )
}

export function DPlayerContent() {
  return (
    <Suspense>
      <PlayerContent />
    </Suspense>
  )
} 