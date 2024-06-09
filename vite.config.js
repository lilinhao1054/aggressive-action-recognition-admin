import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/RPC2': {
        target: getTargetUrl,
        changeOrigin: true
      },
      '/RPC2_Login': {
        target: getTargetUrl,
        changeOrigin: true
      },
      '/RPC_Loadfile': {
        target: getTargetUrl,
        changeOrigin: true
      },
      '/web_caps/': {
        target: getTargetUrl,
        changeOrigin: true
      }
    }
  }
})

function getTargetUrl(req) {
  // 在这里根据您的逻辑获取目标 URL
  // 您可以访问 req 对象来获取请求的一些信息，根据需要进行处理
  // 示例中的逻辑只是一个简单的示例，实际情况可能会有所不同
  if (req.url.startsWith('/RPC2') || req.url.startsWith('/RPC_Loadfile') || req.url.startsWith('/RPC2_Login')) {
    return 'http://' + req.headers['self-targetip'];
  } else if (req.url.startsWith('/web_caps/')) {
    return 'http://' + req.headers['self-targetip'];
  } else {
    // 如果没有匹配的规则，则返回 undefined，使请求不经过代理
    return undefined;
  }
}
