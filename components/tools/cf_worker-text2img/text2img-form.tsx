"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Languages, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function Text2ImgForm() {
  const [prompt, setPrompt] = useState("cyberpunk cat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const translateText = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          prompt
        )}&langpair=zh|en`
      );
      const data = await response.json();
      if (data.responseStatus === 200) {
        setPrompt(data.responseData.translatedText);
      } else {
        throw new Error("翻译失败");
      }
    } catch (error) {
      console.error("翻译错误:", error);
      setError("翻译失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://cloudflare-ai-test.20200511.xyz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("生成图片失败");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("生成图片错误:", error);
      setError("生成图片失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 图片生成</CardTitle>
        <CardDescription>
          使用 Stable Diffusion XL 模型生成图片，支持中英文提示词
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">提示词</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={prompt}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
              disabled={loading}
              className="flex-1"
              placeholder="输入中文或英文提示词"
            />
            <Button
              onClick={translateText}
              disabled={loading}
              variant="outline"
              size="icon"
              title="翻译成英文"
            >
              <Languages className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={generateImage}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            "生成图片"
          )}
        </Button>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {imageUrl && (
          <div className="relative group aspect-square w-full">
            <Image
              src={imageUrl}
              alt="生成的图片"
              fill
              className="object-contain rounded-lg shadow-md"
              unoptimized
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
              <Button
                onClick={downloadImage}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                variant="secondary"
                size="icon"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 