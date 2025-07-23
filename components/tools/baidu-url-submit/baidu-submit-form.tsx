"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Send, Trash2, ExternalLink, Save, Trash, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface SavedConfig {
  id: string;
  name: string;
  token: string;
  site: string;
}

interface GroupedUrls {
  [host: string]: string[];
}

interface SubmitResult {
  host: string;
  success?: number;
  remain?: number;
  not_same_site?: string[];
  not_valid?: string[];
  error?: string;
}

export function BaiduSubmitForm() {
  const [token, setToken] = useState("")
  const [urlList, setUrlList] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SubmitResult[]>([])
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [configName, setConfigName] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [groupedUrls, setGroupedUrls] = useState<GroupedUrls>({})
  const { toast } = useToast()

  useEffect(() => {
    // 加载保存的配置列表
    const configs = localStorage.getItem("baidu_url_configs");
    if (configs) {
      setSavedConfigs(JSON.parse(configs));
    }
  }, []);

  useEffect(() => {
    // 当URL列表变化时，自动分组
    if (urlList.trim()) {
      const urls = urlList.split("\n").map(url => url.trim()).filter(url => url);
      const grouped = groupUrlsByHost(urls);
      setGroupedUrls(grouped);
    } else {
      setGroupedUrls({});
    }
  }, [urlList]);

    const groupUrlsByHost = useCallback((urls: string[]): GroupedUrls => {
    const grouped: GroupedUrls = {};
    
    urls.forEach(url => {
      if (isValidUrl(url)) {
        try {
          const urlObj = new URL(url);
          const host = `${urlObj.protocol}//${urlObj.host}`;
          
          if (!grouped[host]) {
            grouped[host] = [];
          }
          grouped[host].push(url);
        } catch {
          // 无效URL，忽略
        }
      }
    });
    
    return grouped;
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

    if (!token) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写Token！",
      });
      return;
    }

    const newConfig: SavedConfig = {
      id: Date.now().toString(),
      name: configName,
      token,
      site: "", // 百度的site会从URL自动提取，这里留空
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("baidu_url_configs", JSON.stringify(updatedConfigs));
    setSaveDialogOpen(false);
    setConfigName("");

    toast({
      title: "成功",
      description: "配置已保存",
    });
  };

  const loadConfig = (config: SavedConfig) => {
    setToken(config.token);

    toast({
      title: "成功",
      description: "配置已加载",
    });
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("baidu_url_configs", JSON.stringify(updatedConfigs));

    toast({
      title: "成功",
      description: "配置已删除",
    });
  };

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入百度推送Token",
      })
      return
    }

    if (!urlList.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入至少一个要提交的URL",
      })
      return
    }

    if (Object.keys(groupedUrls).length === 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "没有找到有效的URL",
      })
      return
    }

    setLoading(true)
    setResults([])

    const submitResults: SubmitResult[] = [];

    try {
      // 按站点分组提交
      for (const [host, urls] of Object.entries(groupedUrls)) {
        try {
          const response = await fetch(`https://p0.czl.net/http://data.zz.baidu.com/urls?site=${host}&token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'User-Agent': 'BaiduURLSubmit/1.0',
            },
            body: urls.join('\n')
          });

          const data = await response.json();
          
          if (response.ok) {
            submitResults.push({
              host,
              ...data
            });
          } else {
            submitResults.push({
              host,
              error: data.message || `HTTP ${response.status}: 请求失败`
            });
          }
        } catch (error) {
          submitResults.push({
            host,
            error: `网络错误: ${error}`
          });
        }
      }

      setResults(submitResults);

      const successCount = submitResults.filter(r => r.success !== undefined).length;
      const errorCount = submitResults.length - successCount;

      if (errorCount === 0) {
        toast({
          title: "提交成功",
          description: `已成功提交${Object.keys(groupedUrls).length}个站点的URL到百度`,
        });
      } else {
        toast({
          title: "部分成功",
          description: `${successCount}个站点提交成功，${errorCount}个站点提交失败`,
        });
      }
         } catch {
       toast({
         variant: "destructive",
         title: "提交失败",
         description: "请求出错，请检查网络连接和Token是否正确",
       });
     } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setToken("")
    setUrlList("")
    setResults([])
    setGroupedUrls({})
  }

  const isValidUrl = (str: string) => {
    try {
      const url = new URL(str)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>百度 URL 提交工具</CardTitle>
        <CardDescription>
          通过百度搜索资源平台API批量提交URL，自动按站点分组提交<br/>
          数据保存在浏览器本地, 不会上传到任何服务器.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">已保存的配置</CardTitle>
                <CardDescription>点击配置名称可快速加载Token</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
            <Label htmlFor="token">推送Token</Label>
            <div className="flex gap-2">
              <Input
                id="token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="请输入百度搜索资源平台的推送Token"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              请从百度搜索资源平台获取推送Token:{" "}
              <a
                href="https://ziyuan.baidu.com/"
                target="_blank"
                className="inline-flex items-center underline"
              >
                ziyuan.baidu.com
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlList">URL 列表</Label>
            <Textarea
              id="urlList"
              value={urlList}
              onChange={(e) => setUrlList(e.target.value)}
              placeholder="请输入要提交的URL，每行一个"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              每行输入一个完整URL，系统会自动按站点分组提交
            </p>
          </div>

          {Object.keys(groupedUrls).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">URL分组预览</CardTitle>
                <CardDescription>将按以下站点分组提交</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(groupedUrls).map(([host, urls]) => (
                    <div key={host} className="text-sm">
                      <span className="font-medium">{host}</span>
                      <span className="text-muted-foreground ml-2">({urls.length} 个URL)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="flex-1" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  提交到百度
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearForm} disabled={loading}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <Label>提交结果</Label>
            {results.map((result, index) => (
              <Card key={index} className={result.error ? "border-destructive" : "border-green-500"}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {result.host}
                    {result.error ? (
                      <span className="text-sm text-destructive">失败</span>
                    ) : (
                      <span className="text-sm text-green-600">成功</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.error ? (
                    <p className="text-sm text-destructive">{result.error}</p>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <p>成功提交: <span className="font-medium">{result.success}</span> 个URL</p>
                      <p>今日剩余: <span className="font-medium">{result.remain}</span> 次</p>
                      {result.not_same_site && result.not_same_site.length > 0 && (
                        <p className="text-orange-600">非本站URL: {result.not_same_site.length} 个</p>
                      )}
                      {result.not_valid && result.not_valid.length > 0 && (
                        <p className="text-red-600">无效URL: {result.not_valid.length} 个</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <p className="text-sm text-muted-foreground flex items-center mt-2">
              <ExternalLink className="mr-1 h-3 w-3" />
              查看推送记录:{" "}
              <a
                href="https://ziyuan.baidu.com/linksubmit/index"
                target="_blank"
                className="ml-1 underline"
              >
                ziyuan.baidu.com/linksubmit/index
              </a>
            </p>
          </div>
        )}

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
  )
} 