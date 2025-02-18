"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Loader2, Trash2, Send } from "lucide-react";
import Image from "next/image";

interface DouyinResponse {
  type: "图集" | "视频";
  title: string;
  name: string;
  images?: string[];
  video?: string;
}

export function DouyinDownloadForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DouyinResponse | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const extractLink = (text: string) => {
    const match = text.match(/https:\/\/v\.douyin\.com\/[a-zA-Z0-9]+\//);
    return match ? match[0] : null;
  };

  const clearInput = () => {
    setInput("");
    setResult(null);
    setSelectedImages(new Set());
  };

  const downloadFile = (url: string, filename: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "错误",
          description: "下载失败，请重试",
        });
      });
  };

  const handleSubmit = async () => {
    const link = extractLink(input);
    if (!link) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "未找到有效的抖音链接",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://mirror.20200511.xyz/https://api.yujn.cn/api/dy_jx.php?msg=" + encodeURIComponent(link)
      );
      const data = await response.json();

      if (data.type === "视频") {
        window.open(data.video, '_blank');
        clearInput();
      } else {
        setResult(data);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "错误",
        description: "解析失败，请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleImage = (url: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedImages(newSelected);
  };

  const downloadSelected = () => {
    if (!result) return;
    Array.from(selectedImages).forEach((url, index) => {
      downloadFile(url, `${result.title}-${index + 1}.webp`);
    });
  };

  const downloadAll = () => {
    if (!result?.images) return;
    result.images.forEach((url, index) => {
      downloadFile(url, `${result.title}-${index + 1}.webp`);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>抖音图集下载</CardTitle>
        <CardDescription>
          通过分享链接下载抖音图集或打开视频文件
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请粘贴抖音分享文本"
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" onClick={clearInput}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">标题: {result.title}</h3>
              <p className="text-sm text-muted-foreground">作者：{result.name}</p>
            </div>

            {result.type === "图集" && result.images && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  {result.images.map((img, index) => (
                    <div
                      key={img}
                      className="group relative cursor-pointer aspect-square"
                      onClick={() => toggleImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`图片${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedImages.has(img)}
                          className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadSelected}
                    disabled={selectedImages.size === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    下载选中图片
                  </Button>
                  <Button onClick={downloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    下载全部图片
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 