import { Video, Image, Calculator, Clock, Download, Link, FileImage, Trash2, AppWindow, Globe, Server } from "lucide-react";
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
        href: "https://onepage.czl.net/xg/", 
        icon: Video
      },
      { 
        name: "aliplayer", 
        href: "https://onepage.czl.net/aliplayer/", 
        icon: Video
      },
      { 
        name: "ckplayer", 
        href: "https://onepage.czl.net/ckplayer/", 
        icon: Video
      },
      { 
        name: "dplayer", 
        href: "https://onepage.czl.net/dplayer/", 
        icon: Video
      },
    ],
  },
  {
    name: "AI工具",
    items: [
      { 
        name: "AI绘图", 
        href: "/tools/cf_worker-text2img/", 
        icon: Image
      },
    ],
  },
  {
    name: "实用工具",
    items: [
      { 
        name: "流量换算器", 
        href: "/tools/liuliang/", 
        icon: Calculator
      },
      { 
        name: "时间换算器", 
        href: "/tools/shijian/", 
        icon: Clock
      },
      { 
        name: "抖音解析下载", 
        href: "/tools/douyin_download/", 
        icon: Download
      },
      { 
        name: "GitHub加速", 
        href: "/tools/github_proxy/", 
        icon: Link
      }, 
      { 
        name: "在线印章生成工具(做旧,防伪等)仅测试", 
        href: "/tools/seal_generation/", 
        icon: Image
      },
    ],
  },
  {
    name: "图片工具",
    items: [
      { 
        name: "SVG转换器", 
        href: "/tools/svgimg/", 
        icon: FileImage
      },
      { 
        name: "腾讯图片链接转换", 
        href: "/tools/tx_img/", 
        icon: FileImage
      },
      { 
        name: "封面生成工具", 
        href: "/tools/coverview/", 
        icon: Image
      },
      { 
        name: "印章提取工具", 
        href: "/tools/extractstamp/", 
        icon: FileImage
      },
      { 
        name: "图片压缩工具", 
        href: "/tools/squoosh/", 
        icon: Image
      },
      { 
        name: "图片加水印", 
        href: "/tools/watermark/", 
        icon: Image
      },
    ],
  },
  {
    name: "运维工具",
    items: [
      { 
        name: "EdgeOne缓存清理", 
        href: "/tools/eo_cleancache/", 
        icon: Trash2
      },
      { 
        name: "Cloudflare缓存清理", 
        href: "/tools/cloudflare_cache_cleaner/", 
        icon: Trash2
      },
      { 
        name: "Docker镜像服务", 
        href: "/tools/docker_mirror/", 
        icon: Image
      },
      { 
        name: "IP位置信息查询", 
        href: "/tools/ip_query/", 
        icon: Globe
      },
    ],
  },
  {
    name: "SEO工具",
    items: [
      { 
        name: "提交URL到bing", 
        href: "/tools/submiturl_bing/", 
        icon: AppWindow
      },
      { 
        name: "提交URL到百度", 
        href: "/tools/baidu_url_submit/", 
        icon: AppWindow
      },
    ],
  },
  {
    name: "VPS",
    items: [
      { 
        name: "热门VPS促销", 
        href: "https://vps-monitor.czl.net/", 
        icon: Server
      },
      { 
        name: "RackNerd促销", 
        href: "https://vps-monitor.czl.net/pages/racknerd", 
        icon: Server
      },
      { 
        name: "DMIT促销", 
        href: "https://vps-monitor.czl.net/pages/dmit", 
        icon: Server
      },
      { 
        name: "搬瓦工促销", 
        href: "https://vps-monitor.czl.net/pages/bandwagonhost", 
        icon: Server
      },
      { 
        name: "CloudCone促销", 
        href: "https://vps-monitor.czl.net/pages/cloudcone", 
        icon: Server
      },
    ],
  },
];