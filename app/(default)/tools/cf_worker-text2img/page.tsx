import { Text2ImgForm } from "@/components/tools/cf_worker-text2img/text2img-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloudflare AI图片生成",
  description: "使用Cloudflare Worker AI生成图片",
};

export default function Text2ImgPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Text2ImgForm />
    </div>
  );
} 