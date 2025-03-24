import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";
import IframeComponent from "@/components/layout/iframe";
import Script from "next/script";

export const metadata: Metadata = {
  title: "印章提取工具",
  description: "一个从图片中提取印章的工具，支持提取红色印章并导出为透明图片。",
};

export default function ExtractStampPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>印章提取工具</CardTitle>
          <CardDescription>
            选择一张带有印章的图片，自动提取出印章，支持红色印章的提取。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[70vh] w-full">
            <Script 
              src="https://docs.opencv.org/4.5.0/opencv.js" 
              strategy="beforeInteractive"
            />
            <IframeComponent 
              src="/tools/extractstamp/extractstamp.html" 
              title="印章提取工具" 
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