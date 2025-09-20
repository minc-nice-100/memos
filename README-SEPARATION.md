# Memos 前后端分离指南

本文档说明了如何将 Memos 项目进行前后端分离，使前端和后端可以独立开发、部署和运行。

## 项目结构

分离后的项目结构如下：

```
memos/
├── web/                 # 前端项目
│   ├── src/            # 前端源代码
│   ├── package.json    # 前端依赖和脚本
│   ├── vite.config.mts # Vite 配置
│   └── README.md       # 前端说明文档
├── server/             # 后端项目
│   ├── server.go       # 后端主程序
│   └── router/         # 后端路由
├── store/              # 数据层
└── README-BACKEND.md   # 后端说明文档
```

## 前端独立运行

### 安装依赖

```bash
cd web
pnpm install
```

### 开发模式

```bash
cd web
pnpm dev
```

前端默认运行在 http://localhost:3001，API 请求会代理到 http://localhost:8081（后端服务）。

### 生产构建

```bash
cd web
pnpm build
```

构建后的文件将输出到 `web/dist` 目录。

## 后端独立运行

### 开发模式

```bash
go run server/server.go
```

后端默认运行在 http://localhost:8081。

### 生产构建

```bash
go build -o memos-server server/server.go
./memos-server
```

## 部署方案

### 方案1: 前后端分离部署

1. 部署后端服务：
   ```bash
   ./memos-server
   ```

2. 部署前端服务：
   ```bash
   cd web
   npm run preview
   ```

3. 使用 Nginx 反向代理配置，将请求正确路由到前端和后端服务。

### 方案2: Docker 本地开发环境

使用提供的 docker-compose.yml 文件，可以快速启动本地开发环境：

```bash
docker-compose up -d
```

这将启动：
- 后端服务 (端口 8081)
- 前端开发服务 (端口 3001)

停止服务：
```bash
docker-compose down
```

### 方案3: Docker 生产环境部署

1. 构建后端镜像：
   ```bash
   docker build -t memos-backend -f server/Dockerfile .
   ```

2. 使用 Docker Compose 编排后端服务：
   ```yaml
   version: '3'
   services:
     backend:
       image: memos-backend
       ports:
         - "8081:8081"
       environment:
         - MODE=prod
         - DATA=/data/memos.db
       volumes:
         - ./data:/data
   ```

### 方案4: Cloudflare Pages 部署前端

**推荐方案**：前端完全由 Cloudflare Pages 自动部署和托管，无需自己构建和部署。

1. 将前端代码推送到 Git 仓库（GitHub, GitLab 等）
2. 登录 Cloudflare 控制台，进入 Pages 部分
3. 连接你的 Git 仓库
4. 配置构建设置：
   - 构建命令：`pnpm build`
   - 输出目录：`dist`
   - 环境变量：`VITE_API_BASE_URL=https://your-backend-domain.com`
5. 部署设置：
   - 启用自动部署
   - 设置自定义域（可选）
6. 部署完成后，前端将自动部署在 Cloudflare Pages 上

**优势**：
- 全球 CDN 加速
- 自动 HTTPS
- 免费额度
- 自动构建和部署
- 预览环境

### 方案5: Nginx 反向代理配置

使用 Nginx 作为反向代理，将请求路由到前端和后端：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        proxy_pass https://your-cloudflare-pages-url.pages.dev;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # gRPC Web
    location /memos.api.v1/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 文件服务
    location /file/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## API 接口

前后端通过以下接口进行通信：

### RESTful API

- `GET /api/v1/user/profile` - 获取用户信息
- `GET /api/v1/memo` - 获取备忘录列表
- `POST /api/v1/memo` - 创建备忘录
- `PUT /api/v1/memo/:id` - 更新备忘录
- `DELETE /api/v1/memo/:id` - 删除备忘录

### gRPC Web API

- `memos.api.v1.UserService` - 用户服务
- `memos.api.v1.MemoService` - 备忘录服务
- `memos.api.v1.AttachmentService` - 附件服务
- `memos.api.v1.WorkspaceService` - 工作区服务

### 文件服务

- `GET /file/:id` - 获取文件
- `POST /file/upload` - 上传文件

## 开发建议

1. **前端开发**：
   - 使用 `pnpm dev` 启动开发服务器
   - 通过 `DEV_PROXY_SERVER` 环境变量指定后端地址
   - 使用浏览器开发者工具调试网络请求

2. **后端开发**：
   - 使用 `go run server/server.go` 启动开发服务器
   - 使用 `go test` 运行测试
   - 使用 `go mod tidy` 管理依赖

3. **调试**：
   - 前端和后端可以独立调试
   - 使用浏览器开发者工具检查网络请求
   - 使用后端日志查看 API 调用情况

## 常见问题

### Q: 如何修改前端 API 地址？

A: 通过环境变量 `DEV_PROXY_SERVER` 指定后端地址：
```bash
DEV_PROXY_SERVER=http://your-backend:8081 pnpm dev
```

### Q: 如何修改后端监听地址和端口？

A: 通过环境变量 `ADDR` 和 `PORT` 指定：
```bash
ADDR=0.0.0.0 PORT=8082 go run server/server.go
```

### Q: 如何使用不同的数据库？

A: 通过环境变量配置数据库连接：
```bash
# SQLite
DATA=/path/to/memos.db

# MySQL
DRIVER=mysql
DATA_SOURCE=user:password@tcp(host:port)/database?charset=utf8mb4&parseTime=True&loc=Local

# PostgreSQL
DRIVER=postgres
DATA_SOURCE=user=password dbname=database sslmode=host host=host port=port
```
