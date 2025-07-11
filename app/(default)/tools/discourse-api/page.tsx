import DiscourseApiForm from "@/components/tools/discourse-api/discourse-api-form";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discourse API Key 生成工具",
  description: "Discourse API Key 生成工具",
};

export default function DiscourseApiPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discourse API Key 生成工具</h1>
      <DiscourseApiForm />
    </div>
  );
}
