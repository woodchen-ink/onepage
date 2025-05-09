import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";
import IframeComponent from "@/components/layout/iframe";

export const metadata: Metadata = {
  title: "VPS热门促销",
  description: "实时监控全球VPS服务器的促销信息，包括配置、价格和可用区域等详细信息。",
};

export default function ExtractStampPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>VPS热门促销</CardTitle>
          <CardDescription>
            实时监控全球VPS服务器的促销信息，包括配置、价格和可用区域等详细信息。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[70vh] w-full">
            <IframeComponent 
              src="https://vps-monitor.czl.net/" 
              title="VPS热门促销" 
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