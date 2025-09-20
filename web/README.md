# Memos Web 前端

Memos 的前端部分，基于 React 和 TypeScript 开发。

## 开发环境要求

- Node.js 18.18.0 或更高版本
- pnpm 9.0.0 或更高版本

## 安装依赖

```bash
pnpm install
```

## 开发服务器

启动开发服务器，默认监听 http://localhost:3001：

```bash
pnpm dev
```

默认情况下，前端会代理 API 请求到 http://localhost:8081（后端服务）。

如果你需要使用其他后端服务，可以通过环境变量 `DEV_PROXY_SERVER` 指定：

```bash
# 使用环境变量指定后端服务地址
DEV_PROXY_SERVER=http://your-backend-server:8081 pnpm dev
```

## 构建生产版本

构建前端资源：

```bash
pnpm build
```

构建后的资源将输出到 `dist` 目录。

## 预览生产版本

预览生产构建：

```bash
pnpm preview
```

## 代码检查

运行 ESLint 检查：

```bash
pnpm lint
```

运行 TypeScript 类型检查：

```bash
pnpm type-check
```

## API 代理

开发模式下，以下请求会被代理到后端服务：

- `/api/*` - RESTful API 请求
- `/memos.api.v1/*` - gRPC Web 请求
- `/file/*` - 文件请求

## 环境变量

可以通过以下环境变量配置前端应用：

- `DEV_PROXY_SERVER` - 开发模式下 API 请求代理的目标服务器地址

