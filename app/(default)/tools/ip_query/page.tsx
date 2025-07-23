import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metadata } from "next";
import IPQueryForm from "@/components/tools/ip-query/ip-query-form";

export const metadata: Metadata = {
  title: "IP位置信息查询 - 免费在线IP地址查询工具",
  description: "免费的IP位置信息查询工具，支持IPv4和IPv6地址查询。提供详细的地理位置、国家地区、ISP运营商、ASN信息等。支持URL参数查询：?ip=8.8.8.8，自动识别用户IP地址，数据来源MaxMind等权威机构。",
  keywords: ["IP查询", "IP位置查询", "IP地址查询", "IPv4查询", "IPv6查询", "IP地理位置", "IP归属地", "ISP查询", "ASN查询", "在线工具"],
  openGraph: {
    title: "IP位置信息查询 - 免费在线IP地址查询工具",
    description: "免费的IP位置信息查询工具，支持IPv4和IPv6地址查询。提供详细的地理位置、国家地区、ISP运营商、ASN信息等。",
    type: "website",
    url: "https://onepage.czl.net/tools/ip_query",
  },
  twitter: {
    card: "summary",
    title: "IP位置信息查询 - 免费在线IP地址查询工具",
    description: "免费的IP位置信息查询工具，支持IPv4和IPv6地址查询。提供详细的地理位置、国家地区、ISP运营商、ASN信息等。",
  },
  alternates: {
    canonical: "https://onepage.czl.net/tools/ip_query",
  },
};

export default function IPQueryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>IP位置信息查询 - 免费在线IP地址查询工具</CardTitle>
          <CardDescription className="space-y-2">
            <p>免费的IP位置信息查询工具，支持IPv4和IPv6地址查询。提供详细的地理位置、国家地区、ISP运营商、ASN信息等。</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IPQueryForm />
        </CardContent>
      </Card>

      {/* 使用说明和SEO内容 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚀 使用方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">1. 查询本机IP</h4>
              <p className="text-sm text-gray-600">直接访问页面或留空输入框，自动查询您的真实IP地址</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. 查询指定IP</h4>
              <p className="text-sm text-gray-600">在输入框中输入任意IPv4或IPv6地址进行查询</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. URL参数查询</h4>
              <p className="text-sm text-gray-600">使用 <code className="bg-gray-100 px-1 rounded">?ip=8.8.8.8</code> 格式直接在URL中传递IP地址</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">4. 查看详细信息</h4>
              <p className="text-sm text-gray-600">点击提示链接可查看更全面的IP信息和多数据源对比</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 查询信息包含</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">地理位置信息</h4>
              <p className="text-sm text-gray-600">国家、地区、经纬度坐标、精度半径</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">网络信息</h4>
              <p className="text-sm text-gray-600">ISP运营商、ASN号码、IP版本类型</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">数据源</h4>
              <p className="text-sm text-gray-600">MaxMind等权威IP数据库，准确度标识</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">支持格式</h4>
              <p className="text-sm text-gray-600">IPv4 (如: 8.8.8.8) 和 IPv6 (如: 2001:4860:4860::8888)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔧 常见应用场景</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">网络安全分析</h4>
              <p className="text-sm text-gray-600">识别可疑IP来源，分析访问日志</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">网站访问统计</h4>
              <p className="text-sm text-gray-600">了解访客地理分布，优化CDN配置</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">故障排查</h4>
              <p className="text-sm text-gray-600">定位网络问题，检查IP归属</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">合规检查</h4>
              <p className="text-sm text-gray-600">验证IP地址是否符合地域访问限制</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 使用技巧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">批量查询</h4>
              <p className="text-sm text-gray-600">可以逐个输入多个IP地址进行连续查询</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">结果分享</h4>
              <p className="text-sm text-gray-600">使用URL参数功能可以分享特定IP的查询链接</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">精度说明</h4>
              <p className="text-sm text-gray-600">位置精度因IP类型而异，城市级精度较为常见</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">隐私保护</h4>
              <p className="text-sm text-gray-600">所有查询不记录日志，保护用户隐私安全</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}