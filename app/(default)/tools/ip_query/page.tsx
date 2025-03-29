import React from "react";
import IframeComponent from "@/components/layout/iframe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "IP位置信息查询",
  description: "IP位置信息查询 支持20+数据源",
};

export default function CoverviewPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>IP位置信息查询</CardTitle>
          <CardDescription>
          IP位置信息查询 支持20+数据源
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[90vh] w-full">
            <IframeComponent 
              src="https://html.zone/ip/query/" 
              title="IP位置信息查询" 
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
