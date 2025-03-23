import { Metadata } from 'next';
import { ServerVideoGallery } from '@/components/fun/server-video-gallery';
import { VideoSource } from '@/components/fun/video-gallery';

export const metadata: Metadata = {
  title: "随机API精彩视频",
  description: "根据不同的随机API提供视频播放, 支持刷新/下载",
};

// 视频API来源配置
const VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'wm_girls',
    name: '维梦_girl',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/video/girl',
    type: 'json' as const, // API返回JSON数据
    jsonPath: 'data.video' // 视频URL在JSON响应中的路径
  },
  {
    id: 'wm_tianmei',
    name: '维梦_tm',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/video/tianmei',
    type: 'json' as const,
    jsonPath: 'data.video'
  },
  {
    id: 'wm_yule',
    name: '维梦_娱乐',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/video/yule',
    type: 'json' as const,
    jsonPath: 'data.video'
  },
  {
    id: 'yj_girls_1',
    name: '遇见API_1',
    api: 'https://mirror.20200511.xyz/https://api.yujn.cn/api/zzxjj.php',
    type: 'direct' as const // API直接返回视频
  },
  {
    id: 'yj_girls_2',
    name: '遇见API_2',
    api: 'https://mirror.20200511.xyz/https://api.yujn.cn/api/xjj.php',
    type: 'direct' as const // API直接返回视频
  },
  {
    id: 'yj_girls_3',
    name: '遇见API_3',
    api: 'https://mirror.20200511.xyz/https://api.yujn.cn/api/nvda.php',
    type: 'direct' as const // API直接返回视频
  },
  {
    id: 'xx_girls',
    name: '小小API',
    api: 'https://v2.api-m.com/api/meinv',
    type: 'json' as const, // API返回JSON数据
    jsonPath: 'data' // 视频URL在JSON响应中的路径
  },
  // 可以在此添加更多视频API来源
];

export default async function GirlVideoPage() {
  return <ServerVideoGallery title="随机视频" description="浏览器播放器右下角可以下载" sources={VIDEO_SOURCES} />;
}