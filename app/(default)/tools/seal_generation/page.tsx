import React from "react";
import IframeComponent from "@/components/layout/iframe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "在线印章生成工具(做旧,防伪等),仅测试",
  description: "在线印章生成工具(做旧,防伪等),仅测试",
};

export default function CoverviewPage() {
  return (
    <div className="max-w-full mx-auto px-0">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>在线印章生成工具(做旧,防伪等),仅测试</CardTitle>
          <CardDescription>
            可以在线生成印章, 支持防伪, 做旧.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[90vh] w-full">
            <IframeComponent 
              src="https://seal-generation.czl.net/" 
              title="在线印章生成工具" 
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
