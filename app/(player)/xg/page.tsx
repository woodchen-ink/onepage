import { XGPlayerContent } from "@/components/player/xgplayer-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "xgplayer",
  description: "xgplayer，支持多种视频格式",
};

export default function XGPlayerPage() {
  return <XGPlayerContent />;
} 