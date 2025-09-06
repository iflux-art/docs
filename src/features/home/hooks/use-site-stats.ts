/**
 * 统计数据相关钩子函数
 * @module hooks/use-site-stats
 */

"use client";

// import { useBlogPosts } from "@/features/blog/hooks";  // 已移除 blog 版块
import { useDocCategories } from "@/features/docs/hooks";
import type { SiteStats } from "@/features/home/types";
import { useMemo } from "react";

/**
 * 获取网站统计数据
 * @returns 网站各模块的统计数据
 */
export function useSiteStats(): SiteStats & { refresh: () => void } {
  // 禁用缓存，确保每次都从服务器获取最新数据
  // const {
  //   posts: blogPosts,  // 已移除 blog 版块
  //   loading: blogLoading,
  //   error: blogError,
  //   refresh: refreshBlog,
  // } = useBlogPosts();
  const {
    data: docCategories,
    loading: docLoading,
    error: docError,
    refresh: refreshDocs,
  } = useDocCategories();

  const stats = useMemo(() => {
    // 博客数量  // 已移除 blog 版块
    // const blogCount = blogPosts?.length || 0;
    const blogCount = 0; // 固定为0，因为已移除博客功能

    // 文档数量 - 计算所有分类下的文档总数
    const docCount =
      docCategories?.reduce(
        (total: number, category: { count?: number }) => total + (category.count ?? 0),
        0
      ) ?? 0;

    // 友链数量 - 从友链功能获取
    const friendCount = 0; // TODO: 从友链功能获取实际数量

    return {
      blogCount,
      docCount,
      friendCount,
    };
  }, [docCategories]); // 已移除 blogPosts 依赖

  // const loading = blogLoading || docLoading;  // 已移除 blogLoading
  const loading = docLoading;

  // const error = blogError?.message ?? docError?.message ?? null;  // 已移除 blogError
  const error = docError?.message ?? null;

  const refresh = () => {
    // refreshBlog();  // 已移除 refreshBlog
    refreshDocs();
  };

  return {
    ...stats,
    loading,
    error,
    refresh,
  };
}
