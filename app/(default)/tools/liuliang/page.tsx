
import type { Metadata } from "next";
import { TrafficConverterForm } from "@/components/tools/liuliang/traffic-converter-form";

export const metadata: Metadata = {
  title: "流量单位换算器",
  description: "使用这个简单而便捷的流量换算器，可以轻松地在KB, MB, GB, TB之间进行转换。",
};

export default function TrafficConverterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <TrafficConverterForm />
    </div>
  );
} 