"use client"

import { useState, useEffect } from "react"
import { Loader2, Send, Trash2, ExternalLink, Save, Trash } from "lucide-react"

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
  apikey: string;
  siteUrl: string;
}

export function SubmitUrlBingForm() {
  const [apikey, setApikey] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [urlList, setUrlList] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [configName, setConfigName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // 加载保存的配置列表
    const configs = localStorage.getItem("bing_url_configs");
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

    if (!apikey || !siteUrl) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的API Key和站点URL！",
      });
      return;
    }

    const newConfig: SavedConfig = {
      id: Date.now().toString(),
      name: configName,
      apikey,
      siteUrl,
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("bing_url_configs", JSON.stringify(updatedConfigs));
    setSaveDialogOpen(false);
    setConfigName("");

    toast({
      title: "成功",
      description: "配置已保存",
    });
  };

  const loadConfig = (config: SavedConfig) => {
    setApikey(config.apikey);
    setSiteUrl(config.siteUrl);

    toast({
      title: "成功",
      description: "配置已加载",
    });
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("bing_url_configs", JSON.stringify(updatedConfigs));

    toast({
      title: "成功",
      description: "配置已删除",
    });
  };

  const handleSubmit = async () => {
    if (!apikey.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入Bing API Key",
      })
      return
    }

    if (!siteUrl.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入站点URL",
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

    // 检查siteUrl格式
    if (!isValidUrl(siteUrl)) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入有效的站点URL，需包含http://或https://",
      })
      return
    }

    setLoading(true)
    setResult("")

    try {
      // 处理URL列表，按行分割
      const urls = urlList.split("\n").map(url => url.trim()).filter(url => url)
      
      // 检查URL格式
      const invalidUrls = urls.filter(url => !isValidUrl(url))
      if (invalidUrls.length > 0) {
        toast({
          variant: "destructive",
          title: "错误",
          description: `存在${invalidUrls.length}个无效URL，请确保所有URL都包含http://或https://`,
        })
        setLoading(false)
        return
      }

      // 构建请求体
      const requestData = {
        siteUrl,
        urlList: urls
      }

      // 发送请求到Bing API
      const response = await fetch(`https://p0.czl.net/https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${encodeURIComponent(apikey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "提交成功",
          description: `已成功提交${urls.length}个URL到Bing`,
        })
        setResult(JSON.stringify(data, null, 2))
      } else {
        toast({
          variant: "destructive",
          title: "提交失败",
          description: data.message || "请求失败，请检查API Key和参数是否正确",
        })
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "请求出错，请检查网络连接和API Key是否正确",
      })
      setResult(String(error))
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setApikey("")
    setSiteUrl("")
    setUrlList("")
    setResult("")
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
        <CardTitle>Bing URL 提交工具</CardTitle>
        <CardDescription>
          通过Bing Webmaster API批量提交URL，加速搜索引擎收录<br/>
          数据保存在浏览器本地, 不会上传到任何服务器.
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
            <Label htmlFor="apikey">API Key</Label>
            <Input
              id="apikey"
              value={apikey}
              onChange={(e) => setApikey(e.target.value)}
              placeholder="请输入Bing API Key"
            />
            <p className="text-sm text-muted-foreground">
              请从 Bing Webmaster 获取您的 API Key:{" "}
              <a
                href="https://www.bing.com/webmasters/"
                target="_blank"
                className="inline-flex items-center underline"
              >
                bing.com/webmasters
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteUrl">站点 URL</Label>
            <Input
              id="siteUrl"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://yourdomain.com"
            />
            <p className="text-sm text-muted-foreground">
              您需要在 Bing Webmaster Tools 中验证所有权的网站 URL
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
              每行输入一个完整URL，格式：https://yourdomain.com/page1
            </p>
          </div>

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
                  提交到 Bing
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearForm} disabled={loading}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            <Label htmlFor="result">响应结果</Label>
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm overflow-x-auto">{result}</pre>
            </div>
            <p className="text-sm text-muted-foreground flex items-center mt-2">
              <ExternalLink className="mr-1 h-3 w-3" />
              提交记录:{" "}
              <a
                href={`https://www.bing.com/webmasters/submiturl?siteUrl=${encodeURIComponent(siteUrl)}`}
                target="_blank"
                className="ml-1 underline"
              >
                {`https://www.bing.com/webmasters/submiturl?siteUrl=${siteUrl}`}
              </a>{" "}
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