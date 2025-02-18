'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

interface VideoUrlInputProps {
  title: string
  description: string
}

export function VideoUrlInput({ title, description }: VideoUrlInputProps) {
  const [mounted, setMounted] = useState(false)
  const [url, setUrl] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isValidUrl = (str: string) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入视频链接",
      })
      return
    }

    let processedUrl = url.trim()
    
    // 1. 如果输入的是已编码的 URL，先尝试解码
    try {
      const decodedUrl = decodeURIComponent(processedUrl)
      // 如果解码后是有效的 URL，使用解码后的版本
      if (isValidUrl(decodedUrl)) {
        processedUrl = decodedUrl
      }
    } catch {
      // 解码失败，保持原样
    }

    // 2. 如果不是以 http 开头，尝试添加协议
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`
    }

    // 3. 验证最终的 URL
    if (!isValidUrl(processedUrl)) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入有效的视频链接",
      })
      return
    }

    // 4. 编码并在新标签页打开
    const encodedUrl = encodeURIComponent(processedUrl)
    const currentUrl = new URL(window.location.href)
    const videoUrl = `${currentUrl.pathname}?url=${encodedUrl}`
    window.open(videoUrl, '_blank')
  }

  // 在客户端渲染完成前不显示表单
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center mt-32">
        <div className="w-full max-w-2xl px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[88px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center mt-32">
      <div className="w-full max-w-2xl px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="请输入视频链接..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button type="submit" className="w-full">
                在新标签页播放
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 