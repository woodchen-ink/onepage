"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Loader2, Trash2, FileImage } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversionResponse {
  code: number;
  msg: string;
  url?: string;
}

export function TxImageConverterForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const clearInput = () => {
    setInput("");
    setResult(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "成功",
        description: "链接已复制到剪贴板",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "错误",
        description: "复制失败，请手动复制",
      });
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入图片链接",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://p0.czl.net/https://api.yujn.cn/api/upload_tx.php?url=${encodeURIComponent(input.trim())}`
      );
      const data: ConversionResponse = await response.json();

      if (data.code === 200 && data.url) {
        let convertedUrl = data.url;
        if (convertedUrl.startsWith('http://')) {
          convertedUrl = 'https://' + convertedUrl.substring(7);
        }
        setResult(convertedUrl);
        toast({
          title: "成功",
          description: "图片链接转换成功",
        });
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: data.msg || "转换失败，请重试",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "错误",
        description: "转换失败，请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>腾讯图片链接转换</CardTitle>
        <CardDescription>
          将图片链接转换为可直接访问的腾讯系永久链接
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请输入图片链接"
              disabled={loading}
            />
          </div>
          <Button variant="outline" size="icon" onClick={clearInput} disabled={loading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              转换中...
            </>
          ) : (
            <>
              <FileImage className="mr-2 h-4 w-4" />
              转换
            </>
          )}
        </Button>

        {(loading || result) && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">转换结果</h3>
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <Input value={result} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(result)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result}
                        alt="转换后的图片"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p>本工具可以帮助你：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>转换图片链接为腾讯系链接</li>
                <li>支持QQ空间、微信等平台的图片</li>
                <li>转换后的链接可以直接访问</li>
                <li>支持一键复制转换后的链接</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">注意：请确保你有权访问和使用这些图片。</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 