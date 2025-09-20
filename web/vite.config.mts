import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// 默认API服务器地址为本地后端服务
let devProxyServer = "http://localhost:8081";
// 支持通过环境变量覆盖API服务器地址
if (process.env.DEV_PROXY_SERVER && process.env.DEV_PROXY_SERVER.length > 0) {
  console.log("Use devProxyServer from environment: ", process.env.DEV_PROXY_SERVER);
  devProxyServer = process.env.DEV_PROXY_SERVER;
}

// 获取生产环境API地址
const getApiBaseUrl = () => {
  // 在生产环境中，可以通过环境变量配置API地址
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || "/api";
  }
  return devProxyServer;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    codeInspectorPlugin({
      bundler: "vite",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      // API请求代理到后端服务
      "^/api": {
        target: devProxyServer,
        xfwd: true,
        changeOrigin: true,
      },
      // gRPC Web请求代理到后端服务
      "^/memos.api.v1": {
        target: devProxyServer,
        xfwd: true,
        changeOrigin: true,
      },
      // 文件请求代理到后端服务
      "^/file": {
        target: devProxyServer,
        xfwd: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
    },
  },
  build: {
    outDir: "dist", // 指定构建输出目录
    rollupOptions: {
      output: {
        manualChunks: {
          "utils-vendor": ["dayjs", "lodash-es"],
          "katex-vendor": ["katex"],
          "mermaid-vendor": ["mermaid"],
          "leaflet-vendor": ["leaflet", "react-leaflet"],
        },
      },
    },
  },
  define: {
    // 定义全局变量，用于配置API地址
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(getApiBaseUrl()),
  },
});
