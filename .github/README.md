# GitHub Actions 工作流

这个目录包含了 Memos 项目的 GitHub Actions 工作流，用于自动化后端的构建、测试和部署过程。前端部分完全由 Cloudflare Pages 自动处理。

## 工作流文件

### 1. build-backend.yml
用于编译后端代码，支持多平台构建：
- Linux (amd64, arm64)
- macOS (amd64, arm64)
- Windows (amd64, arm64)

触发条件：
- 推送到 main/master 分支
- 创建针对 main/master 分支的 Pull Request

### 2. deploy-backend.yml
用于部署后端到服务器。

触发条件：
- 创建 Release 时
- 手动触发（可选择部署到生产或测试环境）

需要配置的 Secrets：
- `SSH_PRIVATE_KEY`: 用于 SSH 连接的私钥
- `PRODUCTION_SERVER_USER`: 生产服务器用户名
- `PRODUCTION_SERVER_HOST`: 生产服务器地址
- `STAGING_SERVER_USER`: 测试服务器用户名
- `STAGING_SERVER_HOST`: 测试服务器地址

### 3. release.yml
用于创建 GitHub Release 并上传构建产物。

触发条件：
- 推送标签以 v 开头（如 v1.0.0）

## 前端部署说明

前端部署完全由 Cloudflare Pages 自动处理，无需 GitHub Actions。以下是配置步骤：

1. 将前端代码推送到 Git 仓库
2. 登录 Cloudflare 控制台，进入 Pages 部分
3. 连接你的 Git 仓库
4. 配置构建设置：
   - 构建命令：`pnpm build`
   - 输出目录：`dist`
   - 环境变量：`VITE_API_BASE_URL=https://your-backend-domain.com`
5. 部署设置：
   - 启用自动部署
   - 设置自定义域（可选）

优势：
- 全球 CDN 加速
- 自动 HTTPS
- 免费额度
- 自动构建和部署
- 预览环境

## 使用说明

### 1. 配置 Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 Secrets：

#### 后端部署相关
- `SSH_PRIVATE_KEY`: 用于 SSH 连接的私钥
- `PRODUCTION_SERVER_USER`: 生产服务器用户名
- `PRODUCTION_SERVER_HOST`: 生产服务器地址
- `STAGING_SERVER_USER`: 测试服务器用户名
- `STAGING_SERVER_HOST`: 测试服务器地址

#### 前端部署相关
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

### 2. 配置 Cloudflare Pages

1. 登录 Cloudflare 控制台
2. 进入 Pages 部分
3. 连接你的 GitHub 仓库
4. 配置构建设置：
   - 构建命令：`pnpm build`
   - 输出目录：`dist`
   - 环境变量：根据需要添加 `VITE_API_BASE_URL` 等

### 3. 发布新版本

1. 创建标签：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. 这将触发 release.yml 工作流，自动创建 GitHub Release 并上传构建产物。

### 4. 手动触发工作流

在 Actions 页面，可以手动触发某些工作流：
- 部署后端：选择部署环境（生产或测试）
- 部署前端：选择部署环境（生产或预览）

## 最佳实践

1. **分支管理**：使用 main/master 作为主分支，开发功能时创建 feature 分支
2. **代码审查**：所有 Pull Request 需要经过代码审查才能合并
3. **版本控制**：使用语义化版本号（如 v1.0.0）创建标签
4. **环境管理**：使用不同的环境（如生产、测试）进行部署
