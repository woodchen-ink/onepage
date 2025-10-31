import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CZL在线工具箱",
  description: "提供各种免费好用的在线工具，包括视频播放器、文件处理、格式转换、开发工具等",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          id="clarity-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                t=l.createElement(r);t.async=1;t.src="https://analytics.czl.net/ms/t.js?id="+ i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tyq5ttvtfh");
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
