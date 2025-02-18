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
          defer
          src="https://analytics.czl.net/script.js"
          data-website-id="0798c98d-ae45-4530-bd46-52465a66f3c3"
          strategy="afterInteractive"
        />
        <Script
          id="font-loader"
          strategy="beforeInteractive"
        >
          {`
            (function() {
              var ua = navigator.userAgent;
              var isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
              var isApple = /iPhone|iPad|iPod/i.test(ua);
              if (!isMobile && !isApple) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://i.czl.net/g-f/frame/czlfonts/slice/font.css';
                document.head.appendChild(link);
              }
            })();
          `}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
