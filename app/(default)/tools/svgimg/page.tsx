import { SvgConverterForm } from "@/components/tools/svgimg/svg-converter-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG代码转图片",
  description: "在线SVG代码转图片工具，从SVG代码转成可视化图片, 并可以直接下载png格式图片。",
};

export default function SvgConverterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <SvgConverterForm />
    </div>
  );
} 