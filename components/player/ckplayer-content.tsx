'use client'

import { CKPlayer } from '@/components/ui/ck-player'
import { useSearchParams } from 'next/navigation'
import { VideoUrlInput } from './video-url-input'
import { NavBar } from '@/components/layout/nav-bar'

export function CKPlayerContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  if (!url) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <VideoUrlInput 
          title="CK播放器"
          description="功能强大的 HTML5 播放器，支持 m3u8、mp4、flv 等多种格式"
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black">
      <CKPlayer url={url} className="h-full w-full" />
    </div>
  )
} 