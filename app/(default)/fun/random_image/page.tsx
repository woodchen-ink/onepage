import { Metadata } from 'next';
import { ServerImageGallery } from '@/components/fun/server-image-gallery';
import { ImageSource } from '@/components/fun/image-gallery';

export const metadata: Metadata = {
  title: "随机图片 - 免费好用的随机图片服务",
  description: "提供多种随机图片，包括美女图片、风景图片、动漫图片等，可在线浏览和下载",
};

// 图片API来源配置
const IMAGE_SOURCES: ImageSource[] = [
  {
    id: 'xximg_wallpaper',
    name: '小小_4k壁纸',
    api: 'https://v2.api-m.com/api/random4kPic?type=wallpaper',
    type: 'json' as const,
    jsonPath: 'data'
  },
  {
    id: 'xximg_acg',
    name: '小小_4kACG',
    api: 'https://v2.api-m.com/api/random4kPic?type=acg',
    type: 'json' as const,
    jsonPath: 'data'
  },
  {
    id: 'xximg_wallpaper2',
    name: '小小_壁纸',
    api: 'https://v2.api-m.com/api/wallpaper',
    type: 'json' as const,
    jsonPath: 'data'
  },
  {
    id: 'xximg_meinvpc',
    name: '小小_美女',
    api: 'https://v2.api-m.com/api/meinvpic',
    type: 'json' as const,
    jsonPath: 'data'
  },
  {
    id: 'xximg_hs',
    name: '小小_hs',
    api: 'https://v2.api-m.com/api/heisi',
    type: 'json' as const,
    jsonPath: 'data'
  },
  {
    id: 'wm_bing',
    name: '维梦_bing',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/wl/word/bing/tu',
    type: 'json' as const,
    jsonPath: 'data.pc_url'
  },
  {
    id: 'wm_4kphone',
    name: '维梦_4k手机壁纸',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/mo',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_girl',
    name: '维梦_girl',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/girl',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_dongman',
    name: '维梦_动漫',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/man',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_4kpc',
    name: '维梦_4k壁纸',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/pc',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_fengjing',
    name: '维梦_风景',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/view',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_game',
    name: '维梦_游戏',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/game',
    type: 'json' as const,
    jsonPath: 'url'
  },
  {
    id: 'wm_mx',
    name: '维梦_明星',
    api: 'https://mirror.20200511.xyz/https://api.52vmy.cn/api/img/tu/idol',
    type: 'json' as const,
    jsonPath: 'url'
  },
];

export default async function RandomImagePage() {
  return <ServerImageGallery title="随机图片" description="右键图片可以下载, 失败的话点下刷新" sources={IMAGE_SOURCES} />;
} 