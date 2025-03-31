"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Copy, Check, AlertCircle } from "lucide-react";

// RackNerd接口返回的数据结构
interface RackNerdItem {
  id: number;
  pid: number;
  pname: string;        // 标题
  cpu: string;
  ram: string;
  disk: string;
  ip: string;
  location: string;
  bw: string;           // 带宽
  speed: string;
  price: string;
  detail: string;
  monitorUrl: string;
  productUrl: string;
  promoCode: string;
  remark: string;
  level: string;
  fprice: string;
  estimate: string;
  eprice: string;
  flag: string;
  evaluate: string;
  status: number;       // 状态
  mailSend: string;
  coolqSend: string;
  mtime: string;
}

// 统一的VPS数据结构
interface VPSItem {
  id: number;
  title: string;
  cpu: string;
  ram: string;
  disk: string;
  ip: string;
  location: string;
  bandwidth: string;
  price: string;
  productUrl: string;
  promoCode: string | null;
  remark: string;
  monitorStatus: number;
  flag: number;
  monitorTime: string;
  level: number;
}

interface ApiResponse {
  content: RackNerdItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function VPSMonitorPage() {
  const [vpsData, setVpsData] = useState<VPSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // 定义链接修改规则数组
  const linkModifiers = [
    {
      urlPattern: "racknerd.com", // URL中包含的域名
      replacePattern: /aff=\d+/g, // 要替换的正则表达式
      replacement: "aff=12285" // 替换成的内容
    },
  ];

  // 根据规则修改URL
  const modifyUrl = (title: string, originalUrl: string): string => {
    if (!originalUrl) return originalUrl;
    
    let modifiedUrl = originalUrl;
    
    for (const rule of linkModifiers) {
      if (originalUrl.includes(rule.urlPattern)) {
        modifiedUrl = originalUrl.replace(rule.replacePattern, rule.replacement);
        break; // 找到第一个匹配规则后停止
      }
    }
    
    return modifiedUrl;
  };

  // 价格单位中英文替换
  const formatPrice = (price: string): string => {
    if (!price) return "";
    
    return price
      .replace('/Quarterly', '/季度')
      .replace('/Annually', '/年')
      .replace('/Monthly', '/月')
      .replace('/month', '/月')
      .replace('/Year', '/年')
      .replace('/year', '/年')
      .replace('/mo', '/月')
      .replace('/quarter', '/季度')
      .replace('USD Annually', 'USD/年')
      .replace('USD Biennially', 'USD/两年')
      .replace('USD Triennially', 'USD/三年');
  };

  // 将RackNerd数据转换为标准VPS数据
  const mapRackNerdToVPSItem = (item: RackNerdItem): VPSItem => {
    return {
      id: item.id,
      title: item.pname,  // RackNerd使用pname作为标题
      cpu: item.cpu,
      ram: item.ram,
      disk: item.disk,
      ip: item.ip,
      location: item.location,
      bandwidth: item.bw,  // RackNerd使用bw作为带宽
      price: item.price,
      productUrl: item.productUrl,
      promoCode: item.promoCode || null,
      remark: item.remark,
      monitorStatus: item.status, // RackNerd使用status表示状态
      flag: parseInt(item.flag) || 0,
      monitorTime: item.mtime,
      level: parseInt(item.level) || 0
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://i-cf.czl.net/vps_monit_racknerd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageNo: currentPage,
            pageSize: pageSize,
          }),
        });

        if (!response.ok) {
          throw new Error(`请求错误: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        // 转换RackNerd数据结构并应用URL修改规则和价格格式化
        const standardizedData = data.content.map(item => {
          const standardItem = mapRackNerdToVPSItem(item);
          return {
            ...standardItem,
            productUrl: modifyUrl(standardItem.title, standardItem.productUrl),
            price: formatPrice(standardItem.price)
          };
        });
        
        setVpsData(standardizedData);
        
        // 如果API返回了分页信息，则使用它；否则假设总页数为1
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        } else if (data.content && data.content.length > 0) {
          // 如果没有总页数信息但有内容，至少有一页
          setTotalPages(Math.max(1, Math.ceil(data.totalElements / pageSize)));
        } else {
          setTotalPages(1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取数据失败");
        console.error("获取VPS数据错误:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast({
        title: "复制成功",
        description: `优惠码 ${code} 已复制到剪贴板`,
      });
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>RackNerd VPS促销监控</CardTitle>
          <CardDescription>
          实时监控RackNerd VPS服务器的促销信息，包括配置、价格和可用区域等详细信息。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <select
              className="border rounded p-1 text-sm"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>
          </div>
          
          {loading && <p className="text-center py-8">加载中...</p>}
          {error && <p className="text-center py-8 text-red-500">错误: {error}</p>}
          {!loading && !error && vpsData.length === 0 && (
            <p className="text-center py-8">暂无数据</p>
          )}
          {!loading && !error && vpsData.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%]">标题</TableHead>
                    <TableHead className="w-[25%]">配置信息</TableHead>
                    <TableHead className="w-[15%]">位置</TableHead>
                    <TableHead className="w-[15%]">带宽</TableHead>
                    <TableHead className="w-[10%]">价格</TableHead>
                    <TableHead className="w-[13%]">备注</TableHead>
                    <TableHead className="w-[50px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vpsData.map((item) => {
                    const isAvailable = item.monitorStatus === 1;
                    
                    return (
                    <TableRow 
                      key={item.id} 
                      className={!isAvailable ? "opacity-60" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          {!isAvailable && <AlertCircle className="h-3 w-3 text-red-500" aria-label="不可用" />}
                          <span>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-sm">
                          <div className="flex items-center gap-1">
                            <span>{item.cpu}</span>
                          </div>
                          <div>{item.ram}</div>
                          <div>{item.disk}</div>
                          <div className="text-xs text-gray-500">{item.ip}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.bandwidth}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{item.remark}</span>
                          {item.promoCode && (
                            <button 
                              onClick={() => isAvailable && copyToClipboard(item.promoCode!)}
                              className={`text-xs flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded transition-colors ${
                                isAvailable ? "hover:bg-blue-200" : "cursor-not-allowed"
                              }`}
                              disabled={!isAvailable}
                            >
                              {copiedCode === item.promoCode ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>优惠码: {item.promoCode}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => window.open(item.productUrl, "_blank")}
                          title={isAvailable ? "购买" : "无货(可点击)"}
                          className={!isAvailable ? "opacity-50" : ""}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && !error && totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    // 添加省略号
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <PaginationItem>
                            <PaginationLink className="cursor-default">...</PaginationLink>
                          </PaginationItem>
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
