"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

type Unit = "微秒" | "毫秒" | "秒" | "分钟" | "小时" | "天" | "星期" | "月" | "年";

interface ConversionResult {
  微秒: string;
  毫秒: string;
  秒: string;
  分钟: string;
  小时: string;
  天: string;
  星期: string;
  月: string;
  年: string;
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

export function TimeConverterForm() {
  const [value, setValue] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("天");
  const [results, setResults] = useState<ConversionResult>({
    微秒: "",
    毫秒: "",
    秒: "",
    分钟: "",
    小时: "",
    天: "",
    星期: "",
    月: "",
    年: "",
  });
  const { toast } = useToast();

  const convert = (inputValue: string, fromUnit: Unit) => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResults({
        微秒: "",
        毫秒: "",
        秒: "",
        分钟: "",
        小时: "",
        天: "",
        星期: "",
        月: "",
        年: "",
      });
      return;
    }

    let seconds: number;
    switch (fromUnit) {
      case "微秒":
        seconds = num / 1e6;
        break;
      case "毫秒":
        seconds = num / 1000;
        break;
      case "秒":
        seconds = num;
        break;
      case "分钟":
        seconds = num * 60;
        break;
      case "小时":
        seconds = num * 3600;
        break;
      case "天":
        seconds = num * 86400;
        break;
      case "星期":
        seconds = num * 604800;
        break;
      case "月":
        seconds = num * 2592000; // 30天
        break;
      case "年":
        seconds = num * 31536000; // 365天
        break;
      default:
        seconds = 0;
    }

    setResults({
      微秒: formatNumber(seconds * 1e6),
      毫秒: formatNumber(seconds * 1000),
      秒: formatNumber(seconds),
      分钟: formatNumber(seconds / 60),
      小时: formatNumber(seconds / 3600),
      天: formatNumber(seconds / 86400),
      星期: formatNumber(seconds / 604800),
      月: formatNumber(seconds / 2592000),
      年: formatNumber(seconds / 31536000),
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
        <CardTitle>时间换算器</CardTitle>
        <CardDescription>
          在不同的时间单位之间进行换算，支持微秒、毫秒、秒、分钟、小时、天、星期、月、年
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Input
              type="number"
              value={value}
              onChange={handleValueChange}
              placeholder="请输入数值"
            />
          </div>
          <Tabs value={unit} onValueChange={handleUnitChange} className="flex-1 w-full">
            <TabsList className="w-full">
              <div className="flex w-full overflow-x-auto pb-1">
                <TabsTrigger value="微秒" className="min-w-fit">微秒</TabsTrigger>
                <TabsTrigger value="毫秒" className="min-w-fit">毫秒</TabsTrigger>
                <TabsTrigger value="秒" className="min-w-fit">秒</TabsTrigger>
                <TabsTrigger value="分钟" className="min-w-fit">分钟</TabsTrigger>
                <TabsTrigger value="小时" className="min-w-fit">小时</TabsTrigger>
                <TabsTrigger value="天" className="min-w-fit">天</TabsTrigger>
                <TabsTrigger value="星期" className="min-w-fit">星期</TabsTrigger>
                <TabsTrigger value="月" className="min-w-fit">月</TabsTrigger>
                <TabsTrigger value="年" className="min-w-fit">年</TabsTrigger>
              </div>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">换算结果</h3>
          <div className="space-y-2 rounded-lg border p-4">
            {Object.entries(results).map(([unit, value]) => (
              <div key={unit} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-12 text-muted-foreground">{unit}</span>
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
              <p>时间的基本单位是秒（s），更小的单位有微秒（μs）、毫秒（ms），更大的单位有分钟（min）、小时（h）、天（d）等。在描述时间时通常使用小时、天为单位。</p>
              <p>时间单位之间的换算关系是：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>1毫秒 = 1000微秒</li>
                <li>1秒 = 1000毫秒</li>
                <li>1分钟 = 60秒</li>
                <li>1小时 = 60分钟</li>
                <li>1天 = 24小时</li>
                <li>1星期 = 7天</li>
                <li>1月 = 30天（约数）</li>
                <li>1年 = 365天（约数）</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 