'use client'

import { AliPlayer } from '@/components/ui/ali-player'
import { useSearchParams } from 'next/navigation'
import { VideoUrlInput } from './video-url-input'
import { NavBar } from '@/components/layout/nav-bar'

export function AliPlayerContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  if (!url) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <VideoUrlInput 
          title="阿里云播放器"
          description="支持 m3u8、mp4 等多种视频格式，稳定流畅的在线播放体验"
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black">
      <AliPlayer url={url} className="h-full w-full" />
    </div>
  )
} 