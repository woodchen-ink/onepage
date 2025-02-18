import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { tools } from "@/lib/tools";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CZL在线工具箱 - 免费好用的在线工具集合",
  description: "提供各种免费好用的在线工具，包括视频播放器、文件处理、格式转换、开发工具等",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {/* 头部横幅 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">在线工具箱</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            提供各种免费好用的在线工具，让您的工作更轻松高效
          </p>
        </div>

        {/* 工具分类展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((section) => (
            <Card key={section.name} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{section.name}</CardTitle>
                <CardDescription>
                  {section.items.length} 个工具
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.items.slice(0, 3).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  {section.items.length > 3 && (
                    <div className="pt-2 text-sm text-muted-foreground">
                      还有 {section.items.length - 3} 个工具...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="mt-12 text-center">
          <Card className="bg-muted max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>完全免费</span>
                <span>•</span>
                <span>无需注册</span>
                <span>•</span>
                <span>持续更新</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-center w-full">
                由 <Link href="https://q58.club" className="text-blue-500 hover:text-blue-600">Q58论坛</Link> 提供技术支持
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
