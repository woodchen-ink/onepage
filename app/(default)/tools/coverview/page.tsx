import React from "react";
import IframeComponent from "@/components/layout/iframe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "在线封面生成工具",
  description: "一个支持调用unsplash图片的实用封面图片生成工具，可以快速创建各种格式的封面图片。",
};

export default function CoverviewPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>在线封面生成工具</CardTitle>
          <CardDescription>
            一个实用的封面图片生成工具，可以快速创建各种格式的封面图片。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[90vh] w-full">
            <IframeComponent 
              src="https://coverview.czl.net/" 
              title="封面生成工具" 
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
