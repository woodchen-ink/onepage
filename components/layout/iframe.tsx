"use client";

import React from "react";

interface IframeProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  allowFullScreen?: boolean;
  sandbox?: string;
  scale?: number;
}

const IframeComponent = ({
  src,
  title = "Embedded content",
  width = "100%",
  height = "100vh",
  className = "",
  allowFullScreen = true,
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms allow-downloads",
  scale = 1,
}: IframeProps) => {
  return (
    <div className="w-full h-full overflow-hidden" style={{ position: 'relative' }}>
      <iframe
        src={src}
        title={title}
        width={width}
        height={height}
        className={`border-0 ${className}`}
        style={{ 
          transform: scale !== 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top left',
          display: 'block'
        }}
        allowFullScreen={allowFullScreen}
        sandbox={sandbox}
        loading="lazy"
      />
    </div>
  );
};

export default IframeComponent;
