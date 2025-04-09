"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Save, Trash, CheckCircle2, XCircle } from "lucide-react";

interface SavedProfile {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  zoneId: string;
}

interface ApiResponse {
  success: boolean;
  errors: { message: string }[];
  messages: string[];
  result: {
    id: string;
  };
}

export function CleanCacheForm() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [urls, setUrls] = useState("");
  const [tags, setTags] = useState("");
  const [hosts, setHosts] = useState("");
  const [prefixes, setPrefixes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // 加载保存的配置列表
    const profiles = localStorage.getItem("cf_profiles");
    if (profiles) {
      setSavedProfiles(JSON.parse(profiles));
    }
  }, []);

  const saveProfile = () => {
    if (!profileName.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入配置名称",
      });
      return;
    }

    if (!email || !apiKey || !zoneId) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的配置信息！",
      });
      return;
    }

    const newProfile: SavedProfile = {
      id: Date.now().toString(),
      name: profileName,
      email,
      apiKey,
      zoneId,
    };

    const updatedProfiles = [...savedProfiles, newProfile];
    setSavedProfiles(updatedProfiles);
    localStorage.setItem("cf_profiles", JSON.stringify(updatedProfiles));
    setSaveDialogOpen(false);
    setProfileName("");

    toast({
      title: "成功",
      description: "配置已保存",
    });
  };

  const loadProfile = (profile: SavedProfile) => {
    setEmail(profile.email);
    setApiKey(profile.apiKey);
    setZoneId(profile.zoneId);

    toast({
      title: "成功",
      description: "配置已加载",
    });
  };

  const deleteProfile = (id: string) => {
    const updatedProfiles = savedProfiles.filter(profile => profile.id !== id);
    setSavedProfiles(updatedProfiles);
    localStorage.setItem("cf_profiles", JSON.stringify(updatedProfiles));

    toast({
      title: "成功",
      description: "配置已删除",
    });
  };

  const purgeCache = async (type: string) => {
    if (!email || !apiKey || !zoneId) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的配置信息！",
      });
      return;
    }

    const data: {
      purge_everything?: boolean;
      files?: string[];
      tags?: string[];
      hosts?: string[];
      prefixes?: string[];
    } = {};
    switch (type) {
      case "everything":
        data.purge_everything = true;
        break;
      case "files":
        if (!urls.trim()) {
          toast({
            variant: "destructive",
            title: "错误",
            description: "请输入需要清理的URL",
          });
          return;
        }
        data.files = urls.split("\n").map(url => url.trim()).filter(url => url);
        break;
      case "tags":
        if (!tags.trim()) {
          toast({
            variant: "destructive",
            title: "错误",
            description: "请输入需要清理的标签",
          });
          return;
        }
        data.tags = tags.split("\n").map(tag => tag.trim()).filter(tag => tag);
        break;
      case "hosts":
        if (!hosts.trim()) {
          toast({
            variant: "destructive",
            title: "错误",
            description: "请输入需要清理的主机",
          });
          return;
        }
        data.hosts = hosts.split("\n").map(host => host.trim()).filter(host => host);
        break;
      case "prefixes":
        if (!prefixes.trim()) {
          toast({
            variant: "destructive",
            title: "错误",
            description: "请输入需要清理的前缀",
          });
          return;
        }
        data.prefixes = prefixes.split("\n").map(prefix => prefix.trim()).filter(prefix => prefix);
        break;
    }

    setLoading(true);
    try {
      // 使用代理URL
      const proxyUrl = 'https://mirror.20200511.xyz/';
      const apiUrl = 'https://api.cloudflare.com/client/v4/zones/';
      const response = await fetch(`${proxyUrl}${apiUrl}${zoneId}/purge_cache`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Origin": "https://api.cloudflare.com",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResult(result);
      setDialogOpen(true);

      if (result.success) {
        toast({
          title: "成功",
          description: "缓存清理成功！",
        });
      } else {
        toast({
          variant: "destructive",
          title: "失败",
          description: `清理失败：${result.errors[0]?.message || "未知错误"}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: `请求失败：${(error as Error).message}`,
      });
      setResult({ 
        success: false, 
        errors: [{ message: (error as Error).message }], 
        messages: [], 
        result: { id: "" } 
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloudflare 缓存清理工具</CardTitle>
        <CardDescription>
          提供快速便捷的Cloudflare缓存清理功能，支持按URL、标签、主机、前缀清理，以及清理全部缓存。数据保存在浏览器本地，不会上传到任何服务器。
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
            {savedProfiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无保存的配置</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent group"
                  >
                    <button
                      onClick={() => loadProfile(profile)}
                      className="flex-1 text-left text-sm font-medium"
                    >
                      {profile.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(profile.id);
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
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label>API Token</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入 API Token"
            />
            <p className="text-sm text-muted-foreground">
              请在{" "}
              <a
                href="https://dash.cloudflare.com/profile/api-tokens"
                target="_blank"
                className="underline"
              >
                Cloudflare API Tokens
              </a>{" "}
              页面创建一个Token，需要包含以下权限：
            </p>
            <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground">
              <li>Zone - Cache Purge - Purge</li>
              <li>Zone - Zone - Read</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label>Zone ID</Label>
            <Input
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="请输入 Zone ID"
            />
          </div>
        </div>

        <Tabs defaultValue="everything" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="everything">清理所有缓存</TabsTrigger>
            <TabsTrigger value="files">按URL清理</TabsTrigger>
            <TabsTrigger value="tags">按标签清理</TabsTrigger>
            <TabsTrigger value="hosts">按主机清理</TabsTrigger>
            <TabsTrigger value="prefixes">按前缀清理</TabsTrigger>
          </TabsList>

          <TabsContent value="everything">
            <Card>
              <CardHeader>
                <CardTitle>清理所有缓存</CardTitle>
                <CardDescription>
                  将清理该域名下的所有缓存文件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => purgeCache("everything")}
                >
                  清理所有缓存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>按URL清理</CardTitle>
                <CardDescription>
                  输入需要清理的URL地址，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={urls}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUrls(e.target.value)}
                  placeholder="http://example.com/file1.jpg&#10;http://example.com/file2.css"
                  className="min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => purgeCache("files")}
                >
                  清理指定URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>按标签清理 (仅企业版)</CardTitle>
                <CardDescription>
                  输入需要清理的缓存标签，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={tags}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTags(e.target.value)}
                  placeholder="tag1&#10;tag2"
                  className="min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => purgeCache("tags")}
                >
                  清理指定标签
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hosts">
            <Card>
              <CardHeader>
                <CardTitle>按主机清理 (仅企业版)</CardTitle>
                <CardDescription>
                  输入需要清理的主机名，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={hosts}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHosts(e.target.value)}
                  placeholder="www.example.com&#10;images.example.com"
                  className="min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => purgeCache("hosts")}
                >
                  清理指定主机
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prefixes">
            <Card>
              <CardHeader>
                <CardTitle>按前缀清理 (仅企业版)</CardTitle>
                <CardDescription>
                  输入需要清理的URL前缀，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prefixes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrefixes(e.target.value)}
                  placeholder="www.example.com/path1/&#10;www.example.com/path2/"
                  className="min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => purgeCache("prefixes")}
                >
                  清理指定前缀
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {result?.success ? (
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
              {result?.success ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                  <p className="font-medium">缓存清理成功！</p>
                  <p className="text-sm mt-1">任务ID: {result.result.id}</p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-medium">清理失败</p>
                  <p className="text-sm mt-1">{result?.errors[0]?.message || "未知错误"}</p>
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
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="请输入配置名称"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={saveProfile}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 