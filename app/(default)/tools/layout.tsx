import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import { Toaster } from "@/components/toaster";
import "./tools.css";

export const metadata: Metadata = {
  title: "在线工具箱 - 免费好用的在线工具集合",
  description: "提供各种免费好用的在线工具，包括视频播放器、文件处理、格式转换、开发工具等",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen" style={{ backgroundImage: 'url(https://random-api.czl.net/pic/normal)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        <NavBar />
        <main className="container mx-auto p-4 tools-content">
          {children}
        </main>
        <Toaster />
      </div>
    </>
  );
} 