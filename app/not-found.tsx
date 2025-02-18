import { NavBar } from "@/components/layout/nav-bar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">页面未找到</h2>
          <p className="text-muted-foreground max-w-md">
            抱歉，您访问的页面可能已经被移动或删除。您可以使用导航栏查找工具。
          </p>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 