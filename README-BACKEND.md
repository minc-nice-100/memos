# Memos 后端

Memos 的后端部分，基于 Go 语言开发。

## 开发环境要求

- Go 1.22 或更高版本
- 数据库支持：SQLite、MySQL 或 PostgreSQL

## 安装依赖

```bash
go mod download
```

## 配置

创建配置文件 `.env`：

```bash
# 服务配置
ADDR=0.0.0.0
PORT=8081
MODE=dev

# 数据库配置
# SQLite (默认)
# DATA=/path/to/memos.db

# MySQL
# DRIVER=mysql
# DATA_SOURCE=user:password@tcp(host:port)/database?charset=utf8mb4&parseTime=True&loc=Local

# PostgreSQL
# DRIVER=postgres
# DATA_SOURCE=user=password dbname=database sslmode=host host=host port=port
```

## 开发服务器

启动开发服务器：

```bash
go run server/server.go
```

服务器默认监听 http://localhost:8081。

## 构建生产版本

构建二进制文件：

```bash
go build -o memos-server server/server.go
```

运行构建后的二进制文件：

```bash
./memos-server
```

## API 文档

API 文档可通过以下地址访问：

- RESTful API: http://localhost:8081/api/openapi
- gRPC API: http://localhost:8081/memos.api.v1.*

## 前端集成

前端应单独部署，通过以下 API 与后端交互：

- RESTful API: `/api/*`
- gRPC Web API: `/memos.api.v1/*`
- 文件服务: `/file/*`

## 部署

### Docker 部署

使用提供的 Dockerfile：

```bash
docker build -t memos-server .
docker run -p 8081:8081 memos-server
```

### Docker Compose 部署

使用提供的 docker-compose.yml 文件：

```bash
docker-compose up -d
```

这将启动后端服务，并可以与前端服务一起运行。

### Docker 生产环境部署

1. 构建镜像：
   ```bash
   docker build -t memos-server .
   ```

2. 运行容器：
   ```bash
   docker run -d -p 8081:8081 --name memos-server      -e MODE=prod      -v $(pwd)/data:/data      memos-server
   ```

### 使用 Docker 网络与前端通信

如果使用 Docker 部署前端和后端，可以使用 Docker 网络让它们相互通信：

1. 创建网络：
   ```bash
   docker network create memos-network
   ```

2. 启动后端服务：
   ```bash
   docker run -d -p 8081:8081 --name memos-server      --network memos-network      -e MODE=prod      -v $(pwd)/data:/data      memos-server
   ```

3. 启动前端服务：
   ```bash
   docker run -d -p 3000:80 --name memos-frontend      --network memos-network      -e VITE_API_BASE_URL=http://memos-server:8081      memos-frontend
   ```

### Nginx 反向代理配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;  # 前端服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8081;  # 后端服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /memos.api.v1/ {
        proxy_pass http://localhost:8081;  # 后端服务
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /file/ {
        proxy_pass http://localhost:8081;  # 后端服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 环境变量

可以通过环境变量配置后端应用：

- `ADDR` - 服务监听地址
- `PORT` - 服务监听端口
- `MODE` - 运行模式 (dev, prod)
- `DATA` - 数据库路径或连接字符串
- `DATA_SOURCE` - 数据库连接字符串 (可选)
- `DRIVER` - 数据库驱动 (sqlite, mysql, postgres)
