// EdgeOne 边缘函数 - 通用接口反代
// 支持通过数字 ID 映射到不同的反代接口

// 配置映射表 - 将数字 ID 映射到对应的反代接口
const PROXY_CONFIG = {
  '1': 'https://cloudflare-ai-test.20200511.xyz/',
  '2': 'https://q.juxw.com/api/jx.php?url=',
};

// 通用反代处理函数
async function handleGeneralProxy(request, actualUrl) {
  // 构建新的请求头
  const headers = new Headers(request.headers);

  // 设置必要的请求头
  headers.set('Origin', `${actualUrl.protocol}//${actualUrl.host}`);
  headers.set('Referer', `${actualUrl.protocol}//${actualUrl.host}/`);
  headers.set('Host', actualUrl.host);

  // 如果没有 User-Agent，设置默认值
  if (!headers.get('User-Agent')) {
    headers.set('User-Agent', 'Mozilla/5.0');
  }

  // 创建新的请求
  const modifiedRequest = new Request(actualUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow',
  });

  // 发送请求
  const response = await fetch(modifiedRequest);

  // 构建新的响应头
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 创建新的响应
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

// 处理 OPTIONS 请求（CORS 预检）
export function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// 处理所有 HTTP 方法的请求
export async function onRequest(context) {
  try {
    const { request, params } = context;
    const { id } = params;

    // 检查 ID 是否存在于配置中
    if (!PROXY_CONFIG[id]) {
      return new Response(JSON.stringify({
        error: 'Invalid proxy ID',
        message: `Proxy ID "${id}" not found in configuration`
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // 获取目标 URL
    const targetUrl = PROXY_CONFIG[id];
    
    // 解析原始请求 URL 以获取查询参数和路径
    const requestUrl = new URL(request.url);
    const targetBaseUrl = new URL(targetUrl);
    
    // 构建完整的目标 URL（保留查询参数）
    const actualUrl = new URL(targetBaseUrl.pathname + requestUrl.search, targetBaseUrl.origin);

    // 调用反代处理函数
    return await handleGeneralProxy(request, actualUrl);

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
