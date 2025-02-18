import { TxImageConverterForm } from "@/components/tools/tx-img/tx-image-converter-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "腾讯图片链接转换",
  description: "将腾讯系图片链接转换为可直接访问的永久链接",
};

export default function TxImageConverterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <TxImageConverterForm />
    </div>
  );
} 