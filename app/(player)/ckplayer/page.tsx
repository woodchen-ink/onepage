import { CKPlayerContent } from "@/components/player/ckplayer-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ckplayer",
  description: "ckplayer，支持多种视频格式",
};

export default function CKPlayerPage() {
  return <CKPlayerContent />;
} 