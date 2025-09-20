# 贡献指南

本文档说明了如何为 Memos 项目贡献代码，包括如何处理上游仓库的合并。

## 开发环境设置

### 前提条件

- Go 1.22 或更高版本
- Node.js 18.18.0 或更高版本
- pnpm 9.0.0 或更高版本

### 克隆仓库

```bash
git clone https://github.com/your-username/memos.git
cd memos
```

### 安装依赖

```bash
# 安装后端依赖
go mod download

# 安装前端依赖
cd web
pnpm install
cd ..
```

## 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发功能

在前端和后端目录中分别进行开发：

```bash
# 开发后端
cd server
# ...编写代码...
cd ..

# 开发前端
cd web
pnpm dev
# ...编写代码...
cd ..
```

### 3. 提交更改

```bash
git add .
git commit -m "feat: add your feature"
```

### 4. 推送到您的 fork

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

在 GitHub 上创建从您的分支到上游仓库的 Pull Request。

## 从上游合并代码

如果您需要将上游仓库的最新更改合并到您的本地仓库，请按照以下步骤操作：

### 1. 添加上游仓库

```bash
git remote add upstream https://github.com/usememos/memos.git
```

### 2. 获取上游更新

```bash
git fetch upstream
```

### 3. 合并上游更改到您的本地主分支

```bash
git checkout main
git merge upstream/main
```

### 4. 推送到您的 fork

```bash
git push origin main
```

### 5. 如果您的工作分支基于旧的主分支

```bash
git checkout feature/your-feature-name
git merge main
# 解决冲突（如果有）
git add .
git commit -m "Merge main into feature/your-feature-name"
git push origin feature/your-feature-name
```

## 分支策略

我们使用 Git Flow 简化分支策略：

- `main`: 主分支，始终保持可发布状态
- `feature/*`: 功能分支，用于开发新功能
- `release/*`: 发布分支，用于准备发布
- `hotfix/*`: 紧急修复分支，用于修复生产环境的问题

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建或辅助工具的变动

示例：

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login issue"
git commit -m "docs: update README"
```

## 代码审查

所有 Pull Request 需要经过至少一位维护者的审查才能合并。请确保：

1. 代码符合项目规范
2. 所有测试通过
3. 添加了必要的文档
4. 更新了相应的 CHANGELOG

## 发布流程

1. 创建标签：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. 这将触发 GitHub Actions 自动创建 Release 并上传构建产物。

## 常见问题

### Q: 如何解决合并冲突？

A: 当合并上游代码时可能会遇到冲突：

1. 打开冲突文件：
   ```bash
   git status
   ```

2. 编辑冲突文件，解决冲突
3. 标记冲突已解决：
   ```bash
   git add <file>
   ```

4. 完成合并：
   ```bash
   git commit
   ```

### Q: 如何撤销提交？

A: 如果需要撤销最近的提交：

```bash
# 撤销提交但保留更改
git reset HEAD~

# 撤销提交并丢弃更改
git reset --hard HEAD~
```

## 联系方式

如有问题，请通过以下方式联系：

- 创建 Issue
- 在 Pull Request 中讨论
- 加入我们的 Discord 社区
