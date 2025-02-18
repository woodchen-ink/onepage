import { DouyinDownloadForm } from "@/components/tools/douyin-download/douyin-download-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "抖音视频图片下载器",
  description: "下载抖音视频图片，粘贴分享文本即可下载",
};

export default function DouyinDownloadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <DouyinDownloadForm />
    </div>
  );
} 