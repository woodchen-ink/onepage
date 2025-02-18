"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

type Unit = "TB" | "GB" | "MB" | "KB" | "B";

interface ConversionResult {
  B: string;
  KB: string;
  MB: string;
  GB: string;
  TB: string;
}

const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  
  // 对于整数直接返回
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // 对于小数值，统一处理方式
  if (num < 1) {
    // 先转换为字符串，去掉末尾的0
    let str = num.toFixed(10);
    // 去掉末尾的0和可能的小数点
    while (str.endsWith('0')) {
      str = str.slice(0, -1);
    }
    if (str.endsWith('.')) {
      str = str.slice(0, -1);
    }
    return str;
  }
  
  // 一般数值保留3位小数并去掉末尾的0
  let str = num.toFixed(3);
  while (str.endsWith('0')) {
    str = str.slice(0, -1);
  }
  if (str.endsWith('.')) {
    str = str.slice(0, -1);
  }
  return str;
};

export function TrafficConverterForm() {
  const [value, setValue] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("GB");
  const [results, setResults] = useState<ConversionResult>({
    B: "",
    KB: "",
    MB: "",
    GB: "",
    TB: "",
  });
  const { toast } = useToast();

  const convert = (inputValue: string, fromUnit: Unit) => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResults({
        B: "",
        KB: "",
        MB: "",
        GB: "",
        TB: "",
      });
      return;
    }

    let bytes: number;
    switch (fromUnit) {
      case "TB":
        bytes = num * Math.pow(1024, 4);
        break;
      case "GB":
        bytes = num * Math.pow(1024, 3);
        break;
      case "MB":
        bytes = num * Math.pow(1024, 2);
        break;
      case "KB":
        bytes = num * 1024;
        break;
      case "B":
        bytes = num;
        break;
      default:
        bytes = 0;
    }

    setResults({
      B: formatNumber(Math.round(bytes)),
      KB: formatNumber(bytes / 1024),
      MB: formatNumber(bytes / Math.pow(1024, 2)),
      GB: formatNumber(bytes / Math.pow(1024, 3)),
      TB: formatNumber(bytes / Math.pow(1024, 4)),
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    convert(e.target.value, unit);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit as Unit);
    convert(value, newUnit as Unit);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "成功",
        description: "已复制到剪贴板",
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
        <CardTitle>流量换算器</CardTitle>
        <CardDescription>
          在不同的数据流量单位之间进行换算，支持 B、KB、MB、GB、TB
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="w-1/3">
            <Input
              type="number"
              value={value}
              onChange={handleValueChange}
              placeholder="请输入数值"
            />
          </div>
          <Tabs value={unit} onValueChange={handleUnitChange} className="flex-1">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="TB">TB</TabsTrigger>
              <TabsTrigger value="GB">GB</TabsTrigger>
              <TabsTrigger value="MB">MB</TabsTrigger>
              <TabsTrigger value="KB">KB</TabsTrigger>
              <TabsTrigger value="B">B</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">换算结果</h3>
          <div className="space-y-2 rounded-lg border p-4">
            {Object.entries(results).map(([unit, value]) => (
              <div key={unit} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 text-muted-foreground">{unit}</span>
                  <span className="font-mono">{value}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(value)}
                  disabled={!value}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p>网络流量的基本单位是字节（B），更大的单位还有千字节（KB）、兆字节（MB）、吉字节（GB）等。在描述流量包时通常使用MB、GB为单位。</p>
              <p>手机流量以二进制计算，单位之间的进率是2的10次方=1024，也就是：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>1KB = 1024B</li>
                <li>1MB = 1024KB</li>
                <li>1GB = 1024MB</li>
                <li>1TB = 1024GB</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 