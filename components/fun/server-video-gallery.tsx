import { VideoGallery, VideoSource } from './video-gallery';

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

interface ServerVideoGalleryProps {
  title: string;
  description: string;
  sources: VideoSource[];
}

export async function ServerVideoGallery({ title, description, sources }: ServerVideoGalleryProps) {
  let initialVideoUrl = '';

  // 尝试获取第一个源的视频URL
  try {
    const initialSource = sources[0];
    if (initialSource) {
      if (initialSource.type === 'json') {
        const response = await fetch(initialSource.api, { cache: 'no-store' });
        const data = await response.json();
        
        if (data.code === 200 && initialSource.jsonPath) {
          const videoUrl = getValueByPath(data, initialSource.jsonPath);
          if (videoUrl) {
            initialVideoUrl = videoUrl;
          }
        }
      } else if (initialSource.type === 'direct') {
        // 对于direct和redirect类型，都添加缓存破坏参数
        initialVideoUrl = addCacheBustingParams(initialSource.api);
      }
    }
  } catch (error) {
    console.error('初始化视频获取失败:', error);
    // 错误处理由客户端组件负责
  }

  // 将初始数据传递给客户端组件
  return <VideoGallery title={title} description={description} sources={sources} initialVideoUrl={initialVideoUrl} />;
} 