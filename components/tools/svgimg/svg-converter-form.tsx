"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Download, Ruler, FileUp, Copy, ZoomIn, FileDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// SVG示例
const SVG_EXAMPLES = [
  {
    name: "简单图形",
    code: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="100" fill="#4f46e5" rx="10" />
  <circle cx="100" cy="100" r="30" fill="#ffffff" />
</svg>`
  },
  {
    name: "折线图",
    code: `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <polyline points="20,180 60,120 100,160 140,80 180,140 220,40 260,100" 
    fill="none" stroke="#2563eb" stroke-width="3" />
  <circle cx="20" cy="180" r="5" fill="#2563eb" />
  <circle cx="60" cy="120" r="5" fill="#2563eb" />
  <circle cx="100" cy="160" r="5" fill="#2563eb" />
  <circle cx="140" cy="80" r="5" fill="#2563eb" />
  <circle cx="180" cy="140" r="5" fill="#2563eb" />
  <circle cx="220" cy="40" r="5" fill="#2563eb" />
  <circle cx="260" cy="100" r="5" fill="#2563eb" />
</svg>`
  },
  {
    name: "图标",
    code: `<svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L1 21h22L12 2z" fill="none" stroke="#ef4444" stroke-width="2" />
  <path d="M12 16v-5" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
  <circle cx="12" cy="18" r="1" fill="#ef4444" />
</svg>`
  }
];

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${Math.round(bytes)}B`;
  } else if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024 * 10) / 10}KB`;
  } else {
    return `${Math.round(bytes / (1024 * 1024) * 10) / 10}MB`;
  }
};

export function SvgConverterForm() {
  const [svgCode, setSvgCode] = useState("");
  const [bgColor, setBgColor] = useState("transparent");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState(100);
  const [scale, setScale] = useState(100);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastDataURL, setLastDataURL] = useState<string | null>(null);
  const [actualFileSize, setActualFileSize] = useState("0B");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 当SVG代码变化时自动转换
  useEffect(() => {
    if (svgCode.trim() && outputRef.current) {
      outputRef.current.innerHTML = svgCode;
      
      // 获取SVG尺寸
      const svgElement = outputRef.current.querySelector('svg');
      if (svgElement) {
        const width = svgElement.width.baseVal.value || svgElement.viewBox.baseVal.width;
        const height = svgElement.height.baseVal.value || svgElement.viewBox.baseVal.height;
        setDimensions({ width, height });
        
        // 当SVG变化时，重置拖动位置
        setPreviewPosition({ x: 0, y: 0 });
        
        // 生成预览图并估算文件大小
        generatePreview();
      }
    }
  }, [svgCode]);
  
  // 当质量、格式或背景色变化时更新预览
  useEffect(() => {
    if (svgCode.trim()) {
      generatePreview();
    }
  }, [quality, outputFormat, bgColor, scale]);

  // 当背景颜色变化时，强制更新预览容器的样式
  useEffect(() => {
    if (previewContainerRef.current) {
      // 直接设置背景样式以确保透明背景正确应用
      const container = previewContainerRef.current;
      if (bgColor === "transparent") {
        container.style.backgroundColor = "transparent";
        container.style.backgroundImage = "repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%)";
        container.style.backgroundSize = "16px 16px";
      } else {
        container.style.backgroundImage = "none";
        container.style.backgroundColor = bgColor;
      }
    }
  }, [bgColor]);

  // 生成预览图并估算文件大小
  const generatePreview = () => {
    const svgElement = outputRef.current?.querySelector('svg');
    if (!svgElement) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = function() {
        const scaleFactor = scale / 100;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        
        // 使用正确的背景颜色
        if (bgColor !== "transparent") {
          ctx!.fillStyle = bgColor;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 根据选择的格式和质量导出
        const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const dataURL = canvas.toDataURL(mimeType, quality / 100);
        
        // 保存最后一次生成的dataURL，以便在下载时使用
        setLastDataURL(dataURL);
        
        // 估算文件大小
        // 还可以计算实际数据大小
        const actualSize = dataURL.length * 0.75; // base64编码大约比实际大1/3
        setActualFileSize(formatFileSize(actualSize));
      };
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("预览生成失败", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/svg+xml") {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请上传SVG格式的文件",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSvgCode(result);
    };
    reader.readAsText(file);
  };

  const applyExample = (code: string) => {
    setSvgCode(code);
  };

  // 鼠标拖动预览区域相关处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - previewPosition.x,
      y: e.clientY - previewPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPreviewPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 下载图片
  const downloadImage = () => {
    // 如果已经有生成好的dataURL，直接使用它
    if (lastDataURL) {
      const link = document.createElement('a');
      link.download = `svg-image.${outputFormat}`;
      link.href = lastDataURL;
      link.click();
      
      toast({
        title: "成功",
        description: `图片已下载，尺寸: ${Math.round(dimensions.width * scale / 100)}×${Math.round(dimensions.height * scale / 100)}px`,
      });
      return;
    }
    
    // 如果没有，重新生成
    const svgElement = outputRef.current?.querySelector('svg');
    if (!svgElement) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先输入有效的SVG代码",
      });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function () {
        // 应用缩放比例
        const scaleFactor = scale / 100;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        
        // 先填充背景色
        if (bgColor !== "transparent") {
          ctx!.fillStyle = bgColor;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 然后绘制SVG（带缩放）
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 根据选择的格式和质量导出
        const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const dataURL = canvas.toDataURL(mimeType, quality / 100);
        
        const link = document.createElement('a');
        link.download = `svg-image.${outputFormat}`;
        link.href = dataURL;
        link.click();

        // 保存生成的dataURL
        setLastDataURL(dataURL);
        
        // 计算实际文件大小
        const actualSize = dataURL.length * 0.75; // base64编码大约比实际大1/3
        setActualFileSize(formatFileSize(actualSize));

        toast({
          title: "成功",
          description: `图片已下载，尺寸: ${canvas.width}×${canvas.height}px，文件大小约: ${formatFileSize(actualSize)}`,
        });
      };

      const svgData = new XMLSerializer().serializeToString(svgElement);
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      toast({
        variant: "destructive",
        title: "错误",
        description: "转换失败，请检查SVG代码是否正确",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SVG代码转图片</CardTitle>
        <CardDescription>
          将SVG代码转换为可视化图片，支持PNG/JPEG格式导出及多种自定义选项
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="code">输入SVG代码</TabsTrigger>
            <TabsTrigger value="upload">上传SVG文件</TabsTrigger>
            <TabsTrigger value="examples">使用示例</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-2">
            <Textarea
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              placeholder="在这里输入你的SVG代码..."
              className="min-h-[200px] font-mono"
            />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10">
              <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">点击选择或拖放SVG文件</p>
              <Input
                type="file"
                accept=".svg,image/svg+xml"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="max-w-sm"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SVG_EXAMPLES.map((example, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div 
                      className="w-full h-32 flex items-center justify-center mb-2 bg-muted rounded"
                      dangerouslySetInnerHTML={{ __html: example.code }} 
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{example.name}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyExample(example.code)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        使用
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bg-color">背景颜色</Label>
              <Select value={bgColor} onValueChange={setBgColor}>
                <SelectTrigger id="bg-color">
                  <SelectValue placeholder="选择背景颜色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transparent">透明</SelectItem>
                  <SelectItem value="white">白色</SelectItem>
                  <SelectItem value="black">黑色</SelectItem>
                  <SelectItem value="#f0f0f0">浅灰色</SelectItem>
                  <SelectItem value="#e0f7fa">浅蓝色</SelectItem>
                  <SelectItem value="#f9fbe7">浅黄色</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="output-format">输出格式</Label>
              <RadioGroup 
                value={outputFormat} 
                onValueChange={setOutputFormat}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG (支持透明)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpeg" id="jpeg" />
                  <Label htmlFor="jpeg">JPEG (不支持透明)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="quality">图片质量: {quality}%</Label>
                {outputFormat === "jpeg" && (
                  <div className="flex items-center gap-1">
                    <Badge variant={quality < 50 ? "destructive" : quality < 80 ? "default" : "secondary"}>
                      {quality < 50 ? "低" : quality < 80 ? "中" : "高"}
                    </Badge>
                    {actualFileSize !== "0B" && (
                      <span className="text-xs text-muted-foreground">约 {actualFileSize}</span>
                    )}
                  </div>
                )}
              </div>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={(vals: number[]) => setQuality(vals[0])}
                className={outputFormat === "png" ? "opacity-50" : ""}
                disabled={outputFormat === "png"}
              />
              {outputFormat === "png" && (
                <p className="text-xs text-muted-foreground mt-1">PNG格式不支持调整质量</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="scale">缩放比例: {scale}%</Label>
                {actualFileSize !== "0B" && (
                  <div className="flex items-center gap-1">
                    <FileDown className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground">{actualFileSize}</span>
                  </div>
                )}
              </div>
              <Slider
                id="scale"
                min={10}
                max={300}
                step={10}
                value={[scale]}
                onValueChange={(vals: number[]) => setScale(vals[0])}
              />
            </div>
          </div>

          {dimensions.width > 0 && dimensions.height > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>原始尺寸: {dimensions.width} × {dimensions.height}px</span>
              </div>
              <span>|</span>
              <div className="flex items-center gap-1">
                <ZoomIn className="h-4 w-4" />
                <span>输出尺寸: {Math.round(dimensions.width * scale / 100)} × {Math.round(dimensions.height * scale / 100)}px</span>
              </div>
            </div>
          )}

          <h3 className="text-lg font-medium">预览 {scale > 100 && <span className="text-xs text-muted-foreground">(可拖动)</span>}</h3>
          <Card>
            <CardContent className="p-6">
              <div 
                ref={previewContainerRef}
                className="w-full h-[300px] overflow-hidden relative rounded-lg"
                style={{
                  cursor: scale > 100 ? (isDragging ? "grabbing" : "grab") : "default"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  ref={outputRef}
                  className="absolute"
                  style={{
                    transformOrigin: "0 0",
                    transform: `scale(${scale/100}) translate(${previewPosition.x}px, ${previewPosition.y}px)`,
                    transition: isDragging ? "none" : "transform 0.1s ease-out"
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Button 
            onClick={downloadImage} 
            className="w-full" 
            variant="outline"
            disabled={!svgCode.trim()}
          >
            <Download className="mr-2 h-4 w-4" />
            下载{outputFormat.toUpperCase()}图片 
            {actualFileSize !== "0B" && <span className="ml-1 text-xs">({actualFileSize})</span>}
          </Button>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p>SVG（可缩放矢量图形）是一种基于XML的矢量图像格式。本工具可以帮助你：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>预览SVG代码的效果</li>
                <li>从文件导入SVG或使用示例模板</li>
                <li>将SVG转换为PNG/JPEG格式图片</li>
                <li>自定义背景颜色、图片质量和尺寸</li>
                <li>查看图片尺寸信息和预估文件大小</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">提示：放大预览时可以拖动图像查看不同区域；JPEG格式可以调整质量以减小文件大小。</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 