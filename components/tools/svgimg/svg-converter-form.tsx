"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Download, Image as ImageIcon } from "lucide-react";

export function SvgConverterForm() {
  const [svgCode, setSvgCode] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const convertSVG = () => {
    if (!svgCode.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入SVG代码",
      });
      return;
    }

    if (outputRef.current) {
      outputRef.current.innerHTML = svgCode;
    }
  };

  const downloadImage = () => {
    const svgElement = outputRef.current?.querySelector('svg');
    if (!svgElement) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先转换SVG代码",
      });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'svg-image.png';
        link.href = dataURL;
        link.click();

        toast({
          title: "成功",
          description: "图片已下载",
        });
      };

      const svgData = new XMLSerializer().serializeToString(svgElement);
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      toast({
        variant: "destructive",
        title: "错误",
        description: "转换失败，请检查SVG代码是否正确",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SVG代码转图片</CardTitle>
        <CardDescription>
          将SVG代码转换为可视化图片，支持下载为PNG格式
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            placeholder="在这里输入你的SVG代码..."
            className="min-h-[200px] font-mono"
          />
          <Button onClick={convertSVG} className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            转换
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">预览</h3>
          <Card>
            <CardContent className="p-6">
              <div 
                ref={outputRef} 
                className="w-full min-h-[200px] flex items-center justify-center bg-background rounded-lg"
              />
            </CardContent>
          </Card>
          <Button onClick={downloadImage} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            下载PNG图片
          </Button>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p>SVG（可缩放矢量图形）是一种基于XML的矢量图像格式。本工具可以帮助你：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>预览SVG代码的效果</li>
                <li>将SVG转换为PNG格式图片</li>
                <li>支持所有标准的SVG元素和属性</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">注意：某些复杂的SVG效果（如滤镜、渐变等）可能在转换时有细微差异。</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 