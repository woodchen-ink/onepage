// EdgeOne 边缘函数 - 抖音视频下载代理
// 用于避免CORS问题并支持直接下载

// 处理 OPTIONS 请求（CORS 预检）
export function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// 处理 GET 请求
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('video_url');
    const filename = url.searchParams.get('filename');

    if (!videoUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing video_url parameter' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 代理下载视频文件，避免CORS
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.douyin.com/',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 构建响应头
    const responseHeaders = new Headers();
    
    // 设置下载文件名
    if (filename) {
      responseHeaders.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    }
    
    // 设置内容类型
    const contentType = response.headers.get('Content-Type') || 'video/mp4';
    responseHeaders.set('Content-Type', contentType);
    
    // 设置内容长度
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }
    
    // 允许跨域
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // 支持断点续传
    const acceptRanges = response.headers.get('Accept-Ranges');
    if (acceptRanges) {
      responseHeaders.set('Accept-Ranges', acceptRanges);
    }
    
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Download error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to download video',
      message: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理其他 HTTP 方法
export function onRequest(context) {
  return new Response(JSON.stringify({ 
    error: 'Only GET method is allowed' 
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}