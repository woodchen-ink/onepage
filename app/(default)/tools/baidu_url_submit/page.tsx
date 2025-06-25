import { BaiduSubmitForm } from "@/components/tools/baidu-url-submit/baidu-submit-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "百度URL提交工具",
  description: "通过百度搜索资源平台API批量提交URL，自动按站点分组提交，加速搜索引擎收录",
};

export default function BaiduUrlSubmitPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BaiduSubmitForm />
    </div>
  );
} 