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
  play_video?: string;
  cover?: string;
}

export function DouyinDownloadForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DouyinResponse | null>(null);
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
        "https://mirror.20200511.xyz/https://api.yujn.cn/api/dy_jx.php?msg=" + link
      );
      const data = await response.json();

      setResult(data); // 统一设置结果，由渲染层判断
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

            {result.type === "视频" && result.cover && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-64 h-64">
                  <Image
                    src={result.cover}
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
                      if (result.cover) {
                        // 提取后缀
                        const ext =
                          result.cover.includes(".webp")
                            ? "webp"
                            : result.cover.includes(".jpg")
                            ? "jpg"
                            : "png";
                        downloadFile(
                          result.cover,
                          `${result.title || "douyin"}-cover.${ext}`
                        );
                      }
                    }}
                  >
                    下载封面
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (result.play_video)
                        // 尝试 a download 下载，兼容性弱，但部分浏览器支持
                        (() => {
                          const a = document.createElement("a");
                          a.href = result.play_video || "";
                          a.target = "_blank";
                          a.rel = "noopener noreferrer";
                          a.click();
                        })();
                    }}
                  >
                    跳转播放
                  </Button>
                </div>
                {result.play_video && (
                  <div className="w-full flex flex-col items-center gap-2">
                    <Input
                      readOnly
                      value={result.play_video}
                      className="text-xs"
                      onClick={e => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(result.play_video!);
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
