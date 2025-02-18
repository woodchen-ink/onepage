import { DPlayerContent } from "@/components/player/dplayer-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dplayer",
  description: "dplayer，支持多种视频格式",
};

export default function DPlayerPage() {
  return <DPlayerContent />;
} 