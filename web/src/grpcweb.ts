import { createChannel, createClientFactory, FetchTransport } from "nice-grpc-web";
import { ActivityServiceDefinition } from "./types/proto/api/v1/activity_service";
import { AttachmentServiceDefinition } from "./types/proto/api/v1/attachment_service";
import { AuthServiceDefinition } from "./types/proto/api/v1/auth_service";
import { IdentityProviderServiceDefinition } from "./types/proto/api/v1/idp_service";
import { InboxServiceDefinition } from "./types/proto/api/v1/inbox_service";
import { MarkdownServiceDefinition } from "./types/proto/api/v1/markdown_service";
import { MemoServiceDefinition } from "./types/proto/api/v1/memo_service";
import { ShortcutServiceDefinition } from "./types/proto/api/v1/shortcut_service";
import { UserServiceDefinition } from "./types/proto/api/v1/user_service";
import { WorkspaceServiceDefinition } from "./types/proto/api/v1/workspace_service";

// 获取API基础URL，支持环境变量配置
const getApiBaseUrl = () => {
  // 在生产环境中，可以通过环境变量配置API地址
  if (import.meta.env.PROD) {
    // 如果有配置VITE_API_BASE_URL，则使用它
    if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== "/api") {
      return import.meta.env.VITE_API_BASE_URL;
    }
    // 否则使用当前域名
    return window.location.origin;
  }
  // 开发环境使用代理
  return window.location.origin;
};

// 创建gRPC通道
const channel = createChannel(
  getApiBaseUrl(),
  FetchTransport({
    credentials: "include",
  }),
);

const clientFactory = createClientFactory();

export const workspaceServiceClient = clientFactory.create(WorkspaceServiceDefinition, channel);

export const authServiceClient = clientFactory.create(AuthServiceDefinition, channel);

export const userServiceClient = clientFactory.create(UserServiceDefinition, channel);

export const memoServiceClient = clientFactory.create(MemoServiceDefinition, channel);

export const attachmentServiceClient = clientFactory.create(AttachmentServiceDefinition, channel);

export const shortcutServiceClient = clientFactory.create(ShortcutServiceDefinition, channel);

export const inboxServiceClient = clientFactory.create(InboxServiceDefinition, channel);

export const activityServiceClient = clientFactory.create(ActivityServiceDefinition, channel);

export const markdownServiceClient = clientFactory.create(MarkdownServiceDefinition, channel);

export const identityProviderServiceClient = clientFactory.create(IdentityProviderServiceDefinition, channel);
