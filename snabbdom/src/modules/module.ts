import { PreHook, CreateHook, UpdateHook, DestroyHook, RemoveHook, PostHook } from '../hooks';

/**
 * 生命周期钩子的接口类型定义
 */
export interface Module {
  pre: PreHook;
  create: CreateHook;
  update: UpdateHook;
  destroy: DestroyHook;
  remove: RemoveHook;
  post: PostHook;
}