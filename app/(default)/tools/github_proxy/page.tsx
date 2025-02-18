import { GithubProxyForm } from "@/components/tools/github-proxy/github-proxy-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub文件加速",
  description: "加速访问 GitHub 文件，支持 raw、release 等资源",
};

export default function GithubProxyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <GithubProxyForm />
    </div>
  );
} 