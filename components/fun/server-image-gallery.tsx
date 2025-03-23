import { ImageGallery, ImageSource } from './image-gallery';

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

interface ServerImageGalleryProps {
  title: string;
  description: string;
  sources: ImageSource[];
}

export async function ServerImageGallery({ title, description, sources }: ServerImageGalleryProps) {
  let initialImageUrl = '';

  // 尝试获取第一个源的图片URL
  try {
    const initialSource = sources[0];
    if (initialSource) {
      if (initialSource.type === 'json') {
        const response = await fetch(initialSource.api, { cache: 'no-store' });
        const data = await response.json();
        
        if (data.code === 200 && initialSource.jsonPath) {
          const imageUrl = getValueByPath(data, initialSource.jsonPath);
          if (imageUrl) {
            initialImageUrl = imageUrl;
          }
        }
      } else if (initialSource.type === 'direct' || initialSource.type === 'redirect') {
        // 对于direct和redirect类型，都添加缓存破坏参数
        initialImageUrl = addCacheBustingParams(initialSource.api);
      }
    }
  } catch (error) {
    console.error('初始化图片获取失败:', error);
    // 错误处理由客户端组件负责
  }

  // 将初始数据传递给客户端组件
  return <ImageGallery title={title} description={description} sources={sources} initialImageUrl={initialImageUrl} />;
} 