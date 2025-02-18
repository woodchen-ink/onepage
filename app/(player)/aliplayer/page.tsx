import { AliPlayerContent } from "@/components/player/aliplayer-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aliplayer",
  description: "阿里云播放器，支持多种视频格式",
};

export default function AliPlayerPage() {
  return <AliPlayerContent />;
} 