"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, ArrowRight } from "lucide-react";

export function GithubProxyForm() {
  const [githubUrl, setGithubUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const { toast } = useToast();

  const convertGithubUrl = (url: string) => {
    try {
      const githubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
      const matches = url.match(githubRegex);
      
      if (!matches) {
        setConvertedUrl("无效的 GitHub 文件 URL");
        return;
      }

      const [, user, repo, branch, path] = matches;
      setConvertedUrl(`https://i-cf.czl.net/jsdelivr/gh/${user}/${repo}@${branch}/${path}`);
    } catch {
      setConvertedUrl("链接转换失败");
    }
  };

  const copyToClipboard = async () => {
    if (!convertedUrl || convertedUrl.includes("无效") || convertedUrl.includes("失败")) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "没有可复制的有效链接",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(convertedUrl);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub 文件链接转换工具</CardTitle>
        <CardDescription>
          将 GitHub 文件链接转换为 CDN 加速链接，支持所有公开仓库的文件
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">GitHub 文件 URL</h3>
            <div className="flex gap-2">
              <Input
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  convertGithubUrl(e.target.value);
                }}
                placeholder="例如: https://github.com/user/repo/blob/branch/path/file.js"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => convertGithubUrl(githubUrl)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">转换后的链接</h3>
            <div className="flex gap-2">
              <Input
                value={convertedUrl}
                readOnly
                placeholder="转换后的链接将显示在这里"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!convertedUrl || convertedUrl.includes("无效") || convertedUrl.includes("失败")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">使用说明：</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>复制 GitHub 文件的 URL 地址（需要在文件详情页）</li>
            <li>粘贴到输入框中，工具会自动转换</li>
            <li>点击复制按钮获取 CDN 加速链接</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 