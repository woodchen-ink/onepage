"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Loader2, Trash2, Play, Clipboard } from "lucide-react";
import Image from "next/image";

interface NewDouyinResponse {
  code: number;
  message: string;
  data: {
    type: string;
    video_title: string;
    author: {
      uid: string;
      name: string;
      avatar: string;
    };
    video_url: string;
    music_url: string;
    video_info: string;
    images: Array<{
      url: string;
      live_photo_url: string;
    }>;
    content_type: "video" | "images";
  };
}

export function DouyinDownloadForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewDouyinResponse | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // 使其可识别 https://v.douyin.com/xxx 或 https://v.douyin.com/xxx/
  // 并自动过滤所有表情等噪音部分
  const extractLink = (text: string) => {
    // 先移除所有空格和换行
    const raw = text.replace(/\s/g, "");
    // 匹配 https://v.douyin.com/任意有效短链（数字、字母、短横线、下划线），带无结尾斜杠都支持
    const match = raw.match(/https:\/\/v\.douyin\.com\/[a-zA-Z0-9\-_]+\/?/);
    return match ? match[0] : null;
  };

  const clearInput = () => {
    setInput("");
    setResult(null);
    setSelectedImages(new Set());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast({
        title: "已粘贴剪贴板内容",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "粘贴失败",
        description: "无法访问剪贴板，请手动粘贴",
      });
    }
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

  const downloadVideo = () => {
    if (!result?.data?.video_url) return;
    
    const author = result.data.author.name;
    const title = result.data.video_title;
    const filename = `[${author}]-${title}.mp4`;
    
    // 使用边缘函数代理下载
    const proxyUrl = `/api/douyin-download?video_url=${encodeURIComponent(result.data.video_url)}&filename=${encodeURIComponent(filename)}`;
    
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      const encodedUrl = encodeURIComponent(link);
      const response = await fetch(
        `/api/2?url=${encodedUrl}`
      );
      const data: NewDouyinResponse = await response.json();

      if (data.code === 200) {
        setResult(data);
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: data.message || "解析失败，请重试",
        });
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
    if (!result?.data) return;
    const author = result.data.author.name;
    const title = result.data.video_title;
    Array.from(selectedImages).forEach((url, index) => {
      downloadFile(url, `[${author}]-${title}-${index + 1}.webp`);
    });
  };

  const downloadAll = () => {
    if (!result?.data?.images) return;
    const author = result.data.author.name;
    const title = result.data.video_title;
    result.data.images.forEach((img, index) => {
      downloadFile(img.url, `[${author}]-${title}-${index + 1}.webp`);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>抖音解析下载</CardTitle>
        <CardDescription>
          通过分享链接下载抖音图集或打开视频文件
          <br />
          <span className="text-xs text-muted-foreground">接口友情提供: <a href="https://q.juxw.com/" target="_blank" rel="noopener noreferrer">https://q.juxw.com/</a></span>
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
          <Button variant="outline" size="icon" onClick={handlePaste}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" onClick={clearInput}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {result?.data && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">标题: {result.data.video_title}</h3>
              <p className="text-sm text-muted-foreground">作者：{result.data.author.name}</p>
            </div>

            {result.data.content_type === "images" && result.data.images && result.data.images.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  {result.data.images.map((img, index) => (
                    <div
                      key={img.url}
                      className="group relative cursor-pointer aspect-square"
                      onClick={() => toggleImage(img.url)}
                    >
                      <Image
                        src={img.url}
                        alt={`图片${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedImages.has(img.url)}
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

            {result.data.content_type === "video" && result.data.video_info && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-64 h-64">
                  <Image
                    src={result.data.video_info}
                    alt="封面"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (result.data.video_info) {
                        const author = result.data.author.name;
                        const title = result.data.video_title;
                        // 提取后缀
                        const ext =
                          result.data.video_info.includes(".webp")
                            ? "webp"
                            : result.data.video_info.includes(".jpg")
                            ? "jpg"
                            : "png";
                        downloadFile(
                          result.data.video_info,
                          `[${author}]-${title}-cover.${ext}`
                        );
                      }
                    }}
                  >
                    下载封面
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={downloadVideo}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    下载视频
                  </Button>
                </div>
                {result.data.video_url && (
                  <div className="w-full flex flex-col items-center gap-2">
                    <Input
                      readOnly
                      value={result.data.video_url}
                      className="text-xs"
                      onClick={e => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(result.data.video_url!);
                        toast({
                          title: "已复制播放链接，请手动粘贴到新标签页访问（避免403）",
                        });
                      }}
                    >
                      复制播放链接
                    </Button>
                    <div className="text-xs text-muted-foreground">若跳转403，请手动复制上方链接并在浏览器新标签页粘贴访问</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
