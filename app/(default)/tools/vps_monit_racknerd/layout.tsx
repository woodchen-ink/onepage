import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RackNerd VPS促销监控",
  description: "实时监控RackNerd VPS服务器的促销信息，包括配置、价格和可用区域等详细信息。",
};

export default function StockHostMonitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 