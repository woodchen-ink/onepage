import { TimeConverterForm } from "@/components/tools/shijian/time-converter-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "时间单位换算器",
  description: "使用这个简单而便捷的时间换算器，可以轻松地在微秒、毫秒、秒、分钟、小时、天、星期、月和年之间进行转换。无论是工作还是生活场景中，这个工具都能帮助您快速获取所需的时间单位换算结果。",
};

export default function TimeConverterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <TimeConverterForm />
    </div>
  );
} 