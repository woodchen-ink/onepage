"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Save, Trash, CheckCircle2, XCircle } from "lucide-react";

interface SavedConfig {
  id: string;
  name: string;
  secretId: string;
  secretKey: string;
  zoneId: string;
}

interface EOApiResponse {
  Response: {
    RequestId: string;
    JobId: string;
    FailedList: string[];
    Error?: {
      Message: string;
      Code: string;
    };
  };
}

const examples = {
  url: "https://test.czl.net/123.txt",
  prefix: "https://test.czl.net/book/",
  host: "test.czl.net",
  all: "",
  tag: "tag1",
};

export function CleanCacheForm() {
  const [secretId, setSecretId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [targets, setTargets] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<EOApiResponse | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [configName, setConfigName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // 加载保存的配置列表
    const configs = localStorage.getItem("savedConfigs");
    if (configs) {
      setSavedConfigs(JSON.parse(configs));
    }
  }, []);

  const saveConfig = () => {
    if (!configName.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入配置名称",
      });
      return;
    }

    const newConfig: SavedConfig = {
      id: Date.now().toString(),
      name: configName,
      secretId,
      secretKey,
      zoneId,
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));
    setSaveDialogOpen(false);
    setConfigName("");

    toast({
      title: "成功",
      description: "配置已保存",
    });
  };

  const loadConfig = (config: SavedConfig) => {
    setSecretId(config.secretId);
    setSecretKey(config.secretKey);
    setZoneId(config.zoneId);

    toast({
      title: "成功",
      description: "配置已加载",
    });
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));

    toast({
      title: "成功",
      description: "配置已删除",
    });
  };

  const fillExample = (type: keyof typeof examples) => {
    setTargets(examples[type]);
  };

  const callApi = async (type: string, method = "invalidate") => {
    if (!secretId || !secretKey || !zoneId) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的配置信息！",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://eo-cleancache.20200511.xyz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secretId,
          secretKey,
          zoneId,
          type,
          targets: targets.split(",").map((t) => t.trim()).filter((t) => t),
          method,
        }),
      });

      const result = await response.json();
      setResult(result);
      setDialogOpen(true);

      if (result.Response && !result.Response.Error) {
        toast({
          title: "成功",
          description: "操作成功！",
        });
      } else {
        toast({
          variant: "destructive",
          title: "失败",
          description: `操作失败：${
            result.Response?.Error?.Message || "未知错误"
          }`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: `请求失败：${(error as Error).message}`,
      });
      setResult({ 
        Response: {
          RequestId: "",
          JobId: "",
          FailedList: [],
          Error: {
            Message: (error as Error).message,
            Code: "RequestError"
          }
        }
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>腾讯云EdgeOne缓存刷新工具</CardTitle>
        <CardDescription>
          单页面清理腾讯云Edgeone缓存，提供快速便捷的缓存刷新功能，支持URL、目录、Host、全部以及基于缓存标签的刷新操作。数据保存在浏览器本地，不会上传到任何服务器。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">已保存的配置</CardTitle>
                <CardDescription>点击配置名称可快速加载</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setSaveDialogOpen(true)}
                className="h-8"
              >
                <Save className="w-4 h-4 mr-2" />
                保存当前配置
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {savedConfigs.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无保存的配置</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent group"
                  >
                    <button
                      onClick={() => loadConfig(config)}
                      className="flex-1 text-left text-sm font-medium"
                    >
                      {config.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConfig(config.id);
                      }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>SecretId</Label>
            <Input
              value={secretId}
              onChange={(e) => setSecretId(e.target.value)}
              placeholder="请输入 SecretId"
            />
            <p className="text-sm text-muted-foreground">
              从腾讯云API密钥管理页面获取:{" "}
              <a
                href="https://console.cloud.tencent.com/cam/capi"
                target="_blank"
                className="underline"
              >
                https://console.cloud.tencent.com/cam/capi
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label>SecretKey</Label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="请输入 SecretKey"
            />
          </div>

          <div className="space-y-2">
            <Label>ZoneId</Label>
            <Input
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="请输入 ZoneId"
            />
            <p className="text-sm text-muted-foreground">
              从EdgeOne控制台站点信息中获取:{" "}
              <a
                href="https://console.cloud.tencent.com/edgeone/zones"
                target="_blank"
                className="underline"
              >
                https://console.cloud.tencent.com/edgeone/zones
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>目标地址/标签</Label>
            <Input
              value={targets}
              onChange={(e) => setTargets(e.target.value)}
              placeholder="多个地址用英文逗号分隔"
            />
          </div>

          <div className="space-y-2">
            <Label>快速示例</Label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => fillExample("url")}>
                URL刷新示例
              </Button>
              <Button variant="outline" onClick={() => fillExample("prefix")}>
                目录刷新示例
              </Button>
              <Button variant="outline" onClick={() => fillExample("host")}>
                Host刷新示例
              </Button>
              <Button variant="outline" onClick={() => fillExample("all")}>
                全部刷新示例
              </Button>
              <Button variant="outline" onClick={() => fillExample("tag")}>
                Cache Tag示例
              </Button>
            </div>
          </div>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="url">URL刷新</TabsTrigger>
              <TabsTrigger value="prefix">目录刷新</TabsTrigger>
              <TabsTrigger value="host">Host刷新</TabsTrigger>
              <TabsTrigger value="all">刷新全部</TabsTrigger>
              <TabsTrigger value="tag">Cache Tag</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => callApi("purge_url")}
              >
                URL刷新
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                用于刷新具体的URL，需要http/https
              </p>
            </TabsContent>
            <TabsContent value="prefix">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => callApi("purge_prefix")}
              >
                目录刷新
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                用于刷新指定目录下的所有文件，需要http/https
              </p>
            </TabsContent>
            <TabsContent value="host">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => callApi("purge_host")}
              >
                Host刷新
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                用于刷新整个域名的缓存，只填写域名即可
              </p>
            </TabsContent>
            <TabsContent value="all">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => callApi("purge_all")}
              >
                刷新全部
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                清除站点下所有缓存
              </p>
            </TabsContent>
            <TabsContent value="tag">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => callApi("purge_cache_tag")}
              >
                Cache Tag刷新
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                基于缓存标签的刷新（仅企业版）
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {result?.Response && !result.Response.Error ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>操作成功</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span>操作失败</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {result?.Response && !result.Response.Error ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                  <p className="font-medium">缓存清理成功！</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>任务ID: {result.Response.JobId}</p>
                    <p>请求ID: {result.Response.RequestId}</p>
                    {result.Response.FailedList?.length === 0 && (
                      <p className="text-green-600">所有项目清理成功</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-medium">清理失败</p>
                  <p className="text-sm mt-1">
                    {result?.Response?.Error?.Message || "未知错误"}
                  </p>
                </div>
              )}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">详细信息：</p>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存配置</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>配置名称</Label>
                <Input
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="请输入配置名称"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={saveConfig}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}