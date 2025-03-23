'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// 定义API响应的接口
interface JsonResponse {
  code: number;
  msg: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

// 定义视频源的接口
export interface VideoSource {
  id: string;
  name: string;
  api: string;
  type: 'json' | 'direct' | 'redirect';
  jsonPath?: string;
}

// 定义组件的属性
interface VideoGalleryProps {
  title: string;
  description: string;
  sources: VideoSource[];
  initialVideoUrl?: string;
}

// 定义重用的媒体控制组件
export function MediaControls({ 
  isLoading, 
  onRefresh 
}: { 
  url: string; 
  isLoading: boolean; 
  onRefresh: () => void;
}) {
  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? '加载中...' : '刷新'}
      </Button>
    </div>
  );
}

// 定义视频播放器组件
export function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="aspect-video">
      <video
        src={url}
        controls
        autoPlay
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      />
    </div>
  );
}

// 从JSON对象中按路径获取值的辅助函数
function getValueByPath(obj: Record<string, unknown>, path: string): string | null {
  try {
    let result: unknown = obj;
    const keys = path.split('.');
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return null;
      }
    }
    
    return typeof result === 'string' ? result : null;
  } catch {
    return null;
  }
}

// 添加随机参数到URL以避免缓存
function addCacheBustingParams(url: string): string {
  const timestamp = new Date().getTime();
  const randomParam = Math.floor(Math.random() * 1000000);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${timestamp}&_r=${randomParam}`;
}

// 主视频库组件
export function VideoGallery({ title, description, sources, initialVideoUrl = '' }: VideoGalleryProps) {
  const [videoUrl, setVideoUrl] = useState<string>(initialVideoUrl);
  const [loading, setLoading] = useState(false);
  const [currentSource, setCurrentSource] = useState(sources[0]?.id || '');
  const { toast } = useToast();

  const fetchVideo = async (sourceId: string) => {
    try {
      setLoading(true);
      const source = sources.find(s => s.id === sourceId);
      if (!source) return;

      if (source.type === 'json') {
        // 处理返回JSON数据的API
        const response = await fetch(source.api, { cache: 'no-store' });
        const data = await response.json() as JsonResponse;
        
        if (data.code === 200) {
          // 使用jsonPath配置获取视频URL
          const videoUrlFromResponse = source.jsonPath ? getValueByPath(data, source.jsonPath) : null;
          
          if (videoUrlFromResponse) {
            setVideoUrl(videoUrlFromResponse);
          } else {
            throw new Error('无法从响应中获取视频URL');
          }
        } else {
          throw new Error(data.msg as string || '请求失败');
        }
      } else if (source.type === 'direct') {
        // 处理直接返回视频的API
        const urlWithCache = addCacheBustingParams(source.api);
        setVideoUrl(urlWithCache);
      }
    } catch (error) {
      toast({
        title: '获取视频失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 当选项卡改变时处理
  const handleTabChange = (value: string) => {
    setCurrentSource(value);
    fetchVideo(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <MediaControls 
            url={videoUrl} 
            isLoading={loading} 
            onRefresh={() => fetchVideo(currentSource)} 
          />
        </div>

        <p className='text-sm font-sans mb-4'>{description}</p>

        <Tabs defaultValue={currentSource} onValueChange={handleTabChange}>
        <TabsList className="mb-4 w-full px-0">
            <div className="flex w-full overflow-x-auto pb-1">
              {sources.map(source => (
                <TabsTrigger key={source.id} value={source.id} className="min-w-fit">
                  {source.name}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
          
          {sources.map(source => (
            <TabsContent key={source.id} value={source.id}>
              {videoUrl ? (
                <VideoPlayer url={videoUrl} />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  {loading ? '媒体加载中...' : '暂无内容，请点击刷新'}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
} 