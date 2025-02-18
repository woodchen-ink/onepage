import { CleanCacheForm } from "@/components/tools/cloudflare_cache_cleaner/cleancache-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloudflare缓存清理",
  description: "快速清理Cloudflare的CDN缓存,支持按URL、标签、主机、前缀清理，以及清理全部缓存。数据保存在浏览器本地，不会上传到任何服务器。",
};

export default function CloudflareCacheCleanerPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <CleanCacheForm />
    </div>
  );
} 