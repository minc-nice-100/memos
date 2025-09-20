# 多阶段构建 Dockerfile
# 第一阶段：构建阶段
FROM golang:1.22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的工具
RUN apk add --no-cache git

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY .. .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o memos-server ./server.go

# 第二阶段：运行阶段
FROM alpine:latest

# 安装 ca-certificates 用于 HTTPS
RUN apk --no-cache add ca-certificates

# 设置工作目录
WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/memos-server .
COPY --from=builder /app/proto ./proto

# 暴露端口
EXPOSE 8081

# 运行应用
CMD ["./memos-server"]
