"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Server, Shield } from "lucide-react";

interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy_radius: number;
  };
  accuracy: string;
  source: string;
  ipVersion: string;
  as: {
    number: number;
    name: string;
  };
  registered_country: {
    code: string;
    name: string;
  };
}

interface IPQueryFormProps {
  initialIP?: string;
}

export default function IPQueryForm({ initialIP }: IPQueryFormProps) {
  const searchParams = useSearchParams();
  const [ip, setIp] = useState("");
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryIP = async (targetIP?: string) => {
    setLoading(true);
    setError("");
    
    try {
      let response;
      
      if (targetIP) {
        // 查询指定IP - 使用POST请求
        response = await fetch("https://ipinfo.czl.net/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: targetIP }),
        });
      } else {
        // 查询用户自身IP - 使用GET请求
        response = await fetch("https://ipinfo.czl.net/api/query", {
          method: "GET",
        });
      }

      if (!response.ok) {
        throw new Error("查询失败");
      }

      const data = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "查询失败");
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动查询
  useEffect(() => {
    // 优先使用初始IP参数，然后是URL查询参数
    const urlIP = initialIP || searchParams.get('ip');
    
    if (urlIP && isValidIP(urlIP)) {
      setIp(urlIP);
      queryIP(urlIP);
    } else {
      queryIP(); // 查询用户自己的IP
    }
  }, [initialIP, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ip.trim()) {
      queryIP(ip.trim());
    } else {
      queryIP(); // 空输入查询用户自己的IP
    }
  };

  const isValidIP = (ip: string) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  return (
    <div className="space-y-6">
      {/* 查询表单 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            IP位置信息查询
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="输入IP地址 (支持IPv4/IPv6，留空查询本机IP)"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "查询中..." : "查询"}
              </Button>
            </div>
            {ip && !isValidIP(ip) && (
              <p className="text-sm text-red-500">请输入有效的IP地址</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 详细信息提示 */}
      {ipInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 要查看更详细的信息，请访问：
            <a 
              href={`https://ipinfo.czl.net/${ipInfo.ip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:text-blue-900"
            >
              https://ipinfo.czl.net/{ipInfo.ip}
            </a>
          </p>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* IP信息展示 */}
      {ipInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">IP地址</span>
                <Badge variant="outline">{ipInfo.ip}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">IP版本</span>
                <Badge variant="secondary">{ipInfo.ipVersion}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">国家/地区</span>
                <span className="font-medium">{ipInfo.country} ({ipInfo.countryCode})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">注册国家</span>
                <span className="font-medium">{ipInfo.registered_country.name} ({ipInfo.registered_country.code})</span>
              </div>
            </CardContent>
          </Card>

          {/* 位置信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                位置信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">纬度</span>
                <span className="font-medium">{ipInfo.location.latitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">经度</span>
                <span className="font-medium">{ipInfo.location.longitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">精度半径</span>
                <span className="font-medium">{ipInfo.location.accuracy_radius} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">准确度</span>
                <Badge variant={ipInfo.accuracy === 'high' ? 'default' : 'secondary'}>
                  {ipInfo.accuracy}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ASN信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                ASN信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ASN号码</span>
                <Badge variant="outline">AS{ipInfo.as.number}</Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">运营商</span>
                <p className="font-medium mt-1">{ipInfo.as.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* 数据源信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                数据源
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">数据提供商</span>
                <Badge variant="outline">{ipInfo.source}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}