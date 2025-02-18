"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Terminal } from "lucide-react";

export function DockerMirrorForm() {
  const [imageInput, setImageInput] = useState("");
  const [dockerPullCommand, setDockerPullCommand] = useState("");
  const [dockerTagCommand, setDockerTagCommand] = useState("");
  const [dockerRmiCommand, setDockerRmiCommand] = useState("");
  const { toast } = useToast();

  const getSourceFromImage = (imageInput: string) => {
    const currentDomain = 'docker-mirror.20200511.xyz';
    if (imageInput.startsWith("gcr.io/")) {
      return `${currentDomain}/gcr`;
    } else if (imageInput.startsWith("k8s.gcr.io/")) {
      return `${currentDomain}/k8sgcr`;
    } else if (imageInput.startsWith("quay.io/")) {
      return `${currentDomain}/quay`;
    } else if (imageInput.startsWith("ghcr.io/")) {
      return `${currentDomain}/ghcr`;
    } else {
      return currentDomain;
    }
  };

  const getImageNameFromInput = (imageInput: string) => {
    if (imageInput.startsWith("gcr.io/")) {
      return imageInput.replace("gcr.io/", "");
    } else if (imageInput.startsWith("k8s.gcr.io/")) {
      return imageInput.replace("k8s.gcr.io/", "");
    } else if (imageInput.startsWith("quay.io/")) {
      return imageInput.replace("quay.io/", "");
    } else if (imageInput.startsWith("ghcr.io/")) {
      return imageInput.replace("ghcr.io/", "");
    } else {
      return imageInput;
    }
  };

  const generateCommands = () => {
    if (!imageInput.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入镜像地址",
      });
      return;
    }

    const source = getSourceFromImage(imageInput);
    const imageName = getImageNameFromInput(imageInput);
    setDockerPullCommand(`docker pull ${source}/${imageName}`);
    setDockerTagCommand(`docker tag ${source}/${imageName} ${imageName}`);
    setDockerRmiCommand(`docker rmi ${source}/${imageName}`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "成功",
        description: "命令已复制到剪贴板",
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
        <CardTitle>Docker镜像服务</CardTitle>
        <CardDescription>
          提供快速便捷的Docker镜像代理拉取服务，支持多种镜像源，包括docker.io, ghcr, quay, k8sgcr, gcr等。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4 text-sm text-gray-500">
          <p>提示，支持以下镜像源：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>docker.io: woodchen/simplemirrorfetch</li>
            <li>gcr.io: gcr.io/woodchen/simplemirrorfetch</li>
            <li>quay.io: quay.io/woodchen/simplemirrorfetch</li>
            <li>ghcr.io: ghcr.io/woodchen/simplemirrorfetch</li>
            <li>k8s.gcr.io: k8s.gcr.io/woodchen/simplemirrorfetch</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">第一步：输入原始镜像地址获取命令</h3>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="例如：woodchen/simplemirrorfetch"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={generateCommands}
                title="获取命令"
              >
                <Terminal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">第二步：代理拉取镜像</h3>
            <div className="flex gap-2">
              <Textarea
                value={dockerPullCommand}
                readOnly
                placeholder='点击"获取命令"按钮生成拉取命令'
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(dockerPullCommand)}
                disabled={!dockerPullCommand}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">第三步：重命名镜像</h3>
            <div className="flex gap-2">
              <Textarea
                value={dockerTagCommand}
                readOnly
                placeholder='点击"获取命令"按钮生成重命名命令'
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(dockerTagCommand)}
                disabled={!dockerTagCommand}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">第四步：删除代理镜像</h3>
            <div className="flex gap-2">
              <Textarea
                value={dockerRmiCommand}
                readOnly
                placeholder='点击"获取命令"按钮生成删除命令'
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(dockerRmiCommand)}
                disabled={!dockerRmiCommand}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 