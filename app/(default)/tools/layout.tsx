import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import { Toaster } from "@/components/toaster";


//meta拼接模板
export const metadata: Metadata = {
  title: {
    template: "%s - CZL在线工具箱 - 免费好用的在线工具集合",
    default: "CZL在线工具箱 - 免费好用的在线工具集合",
  },
  description: "提供各种免费好用的在线工具，包括视频播放器、文件处理、格式转换、开发工具等",
  openGraph: {
    title: {
      template: "%s - CZL在线工具箱 - 免费好用的在线工具集合",
      default: "CZL在线工具箱 - 免费好用的在线工具集合",
    },
    description: "提供各种免费好用的在线工具，包括视频播放器、文件处理、格式转换、开发工具等",
  },
  alternates: {
    canonical: "https://onepage.czl.net",
  },
};


export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <NavBar />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Toaster />
    </>
  );
} 