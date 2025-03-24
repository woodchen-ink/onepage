import { SubmitUrlBingForm } from "@/components/tools/submiturl_bing/submiturl-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bing URL提交工具",
  description: "通过Bing Webmaster API批量提交URL，加速搜索引擎收录网站内容",
};

export default function BingUrlSubmitPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <SubmitUrlBingForm />
    </div>
  );
}
