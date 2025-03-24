import React from "react";
import IframeComponent from "@/components/layout/iframe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "在线图片加水印",
  description: "在线给图片加水印,通过前端canvas给你的个人证件加上水印，防止身份证复印件被盗。纯前端加水印,拒绝上传保证个人信息安全!",
};

export default function CoverviewPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>在线图片加水印</CardTitle>
          <CardDescription>
          在线给图片加水印,通过前端canvas给你的个人证件加上水印，防止身份证复印件被盗。纯前端加水印,拒绝上传保证个人信息安全!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[90vh] w-full">
            <IframeComponent 
              src="https://watermark.czl.net/" 
              title="在线图片加水印" 
              height="100%"
              allowFullScreen={true}
              scale={1}
              className="overflow-visible"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
