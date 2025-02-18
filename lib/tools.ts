import { Video, Image, Calculator, Clock, Download, Link, FileImage, Trash2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface ToolSection {
  name: string;
  items: ToolItem[];
}

export const tools: ToolSection[] = [
  {
    name: "视频播放器",
    items: [
      { 
        name: "xgplayer", 
        href: "/xg", 
        icon: Video
      },
      { 
        name: "aliplayer", 
        href: "/aliplayer", 
        icon: Video
      },
      { 
        name: "ckplayer", 
        href: "/ckplayer", 
        icon: Video
      },
      { 
        name: "dplayer", 
        href: "/dplayer", 
        icon: Video
      },
    ],
  },
  {
    name: "AI工具",
    items: [
      { 
        name: "AI绘图", 
        href: "/tools/cf_worker-text2img", 
        icon: Image
      },
    ],
  },
  {
    name: "实用工具",
    items: [
      { 
        name: "流量换算器", 
        href: "/tools/liuliang", 
        icon: Calculator
      },
      { 
        name: "时间换算器", 
        href: "/tools/shijian", 
        icon: Clock
      },
      { 
        name: "抖音图集下载", 
        href: "/tools/douyin_download", 
        icon: Download
      },
      { 
        name: "GitHub加速", 
        href: "/tools/github_proxy", 
        icon: Link
      },
    ],
  },
  {
    name: "图片工具",
    items: [
      { 
        name: "SVG转换器", 
        href: "/tools/svgimg", 
        icon: FileImage
      },
      { 
        name: "腾讯图片链接转换", 
        href: "/tools/tx_img", 
        icon: FileImage
      },
    ],
  },
  {
    name: "运维工具",
    items: [
      { 
        name: "EdgeOne缓存清理", 
        href: "/tools/eo_cleancache", 
        icon: Trash2
      },
      { 
        name: "Cloudflare缓存清理", 
        href: "/tools/cloudflare_cache_cleaner", 
        icon: Trash2
      },
      { 
        name: "Docker镜像服务", 
        href: "/tools/docker_mirror", 
        icon: Image
      },
    ],
  },
]; 