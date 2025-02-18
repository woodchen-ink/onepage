import { DockerMirrorForm } from "@/components/tools/docker-mirror/docker-mirror-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docker镜像加速",
  description: "提供快速的Docker镜像拉取服务，支持多个镜像源",
};

export default function DockerMirrorPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <DockerMirrorForm />
    </div>
  );
} 