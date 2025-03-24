import React from "react";
import IframeComponent from "@/components/layout/iframe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "图片在线压缩",
  description: "通过浏览器本身功能进行图片本地压缩, 支持jpeg, avif, webp等, 最高可压缩90%文件大小.",
};

export default function CoverviewPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>图片在线压缩</CardTitle>
          <CardDescription>
          通过浏览器本身功能进行图片本地压缩, 支持jpeg, avif, webp等, 最高可压缩90%文件大小.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[90vh] w-full">
            <IframeComponent 
              src="https://squoosh.czl.net/" 
              title="图片在线压缩" 
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
