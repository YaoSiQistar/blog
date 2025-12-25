"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Copy, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { toast } from "sonner";
import FiltersSheet from "./FiltersSheet";
import { parsePostsQuery, updatePostsQuery } from "./query";

// 定义项目项类型，包含slug和数量
type KintsugItem = { slug: string; count: number };

// 定义编辑工作台组件的属性类型
type EditorialWorkbenchProps = {
  tags: KintsugItem[];  // 标签数组
};

// 编辑工作台组件 - 用于文章搜索、筛选和排序的交互式工具栏
// 提供搜索框、排序选项、标签选择器和过滤器重置功能
export default function EditorialWorkbench({ tags }: EditorialWorkbenchProps) {
  // 获取路由器实例，用于导航
  const router = useRouter();
  // 获取当前搜索参数
  const searchParams = useSearchParams();
  // 检查用户是否偏好减少动画
  const reducedMotion = useReducedMotion();
  // 获取动画标志
  const flags = useMotionFlags();
  // 综合判断是否需要减少动画效果
  const reduced = reducedMotion || flags.reduced;
  // 解析当前查询参数为状态对象
  const current = React.useMemo(() => parsePostsQuery(searchParams), [searchParams]);
  // 状态用于存储搜索输入值
  const [searchValue, setSearchValue] = React.useState(current.q ?? "");
  // 状态用于控制标签选择器是否打开
  const [tagsOpen, setTagsOpen] = React.useState(false);

  // 当URL中的搜索参数改变时，更新搜索输入框的值
  React.useEffect(() => {
    setSearchValue(current.q ?? "");
  }, [current.q]);

  // 处理搜索表单提交事件
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();  // 阻止表单默认提交行为
    const nextValue = searchValue.trim() || undefined;  // 获取搜索值，去除空格，如果为空则设为undefined
    const { href } = updatePostsQuery(searchParams, { next: { q: nextValue } });
    if (href) router.push(href);
  };

  // 处理排序方式改变事件
  const handleSortChange = (value: string) => {
    if (!value) return;
    const { href } = updatePostsQuery(searchParams, { next: { sort: value as "latest" | "hot" } });
    if (href) router.push(href);
  };

  // 处理标签切换事件
  const handleTagToggle = (slug: string) => {
    // 如果标签已选中，则从选中列表中移除；否则添加到选中列表
    const nextTags = current.tags.includes(slug)
      ? current.tags.filter((tag) => tag !== slug)
      : [...current.tags, slug];
    const { href } = updatePostsQuery(searchParams, { next: { tags: nextTags } });
    if (href) router.push(href);
  };

  // 处理重置按钮点击事件
  const handleReset = () => {
    // 重置所有筛选条件，包括分类、标签、搜索词、排序方式和页码
    const { href } = updatePostsQuery(searchParams, {
      next: { category: undefined, tags: [], q: undefined, sort: "latest", page: 1 },
      resetPage: true,
    });
    if (href) router.push(href);
  };

  // 处理复制链接按钮点击事件
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);  // 复制当前页面URL到剪贴板
      toast.success("Kintsug link copied.");  // 显示成功提示
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy link.");  // 显示错误提示
    }
  };

  return (
    <div className="space-y-4">  {/* 主容器 */}
      {/* 带动画效果的搜索表单 */}
      <motion.form
        variants={fadeUp(reduced)}  
        initial="hidden"            
        animate="visible"           
        onSubmit={handleSearchSubmit}  
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card/70 p-4"
        )}
      >
        {/* 搜索输入框容器 */}
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-background/70 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />  {/* 搜索图标 */}
          <Input
            value={searchValue}  
            onChange={(event) => setSearchValue(event.target.value)}  
            placeholder="Search the archive"  
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"  
            aria-label="Search posts"  
          />
        </div>

        {/* 排序切换组 */}
        <ToggleGroup
          type="single"  
          value={current.sort}  
          onValueChange={handleSortChange}  
          className="rounded-full border border-border-subtle bg-background/70 p-1"
        >
          <ToggleGroupItem value="latest" className="px-3 text-xs uppercase tracking-[0.3em]">
            Latest  {/* 最新排序选项 */}
          </ToggleGroupItem>
          <ToggleGroupItem value="hot" className="px-3 text-xs uppercase tracking-[0.3em]">
            Hot  {/* 热门排序选项 */}
          </ToggleGroupItem>
        </ToggleGroup>

        {/* 标签选择器弹出框 */}
        <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
          <PopoverTrigger asChild>
            <Button variant="secondary" className="rounded-full">
              Tags ({current.tags.length})  {/* 显示当前选中的标签数量 */}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">  {/* 弹出框内容 */}
            <Command>  {/* 命令菜单组件 */}
              <CommandInput placeholder="Filter tags" />  {/* 标签过滤输入框 */}
              <CommandList>  {/* 命令列表 */}
                <CommandEmpty>No tags found.</CommandEmpty>  {/* 未找到标签时的提示 */}
                <CommandGroup heading="Tags">  {/* 标签组 */}
                  {tags.map((tag) => {
                    const active = current.tags.includes(tag.slug); 
                    return (
                      <CommandItem
                        key={tag.slug}
                        value={tag.slug}
                        onSelect={() => handleTagToggle(tag.slug)}  
                        className="flex items-center justify-between" 
                      >
                        <span className="text-sm">{tag.slug}</span>  {/* 标签名称 */}
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {tag.count}  {/* 标签计数 */}
                          {active && <Check className="size-3" />}  {/* 选中状态的勾选图标 */}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 重置按钮 */}
        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset
        </Button>

        {/* 复制链接按钮 */}
        <Button type="button" variant="ghost" onClick={handleCopy} aria-label="Copy Kintsug link">
          <Copy className="mr-2 size-4" /> Copy link
        </Button>

        {/* 移动端过滤器抽屉（仅在小屏幕显示） */}
        <div className="ml-auto lg:hidden">
          <FiltersSheet tags={tags} />
        </div>
      </motion.form>

      {/* 当前活动过滤器标签行 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 分类过滤器标签 */}
        {current.category && (
          <Badge className="rounded-full border border-border-subtle bg-primary/10 text-xs uppercase tracking-[0.3em] text-foreground">
            Gallery: {current.category}  {/* 显示分类名称 */}
            <button
              type="button"
              onClick={() => {
                const { href } = updatePostsQuery(searchParams, { next: { category: undefined } });
                if (href) router.push(href);
              }}
              className="ml-2"
              aria-label="Remove category filter"  
            >
              <X className="size-3" />  {/* 关闭图标 */}
            </button>
          </Badge>
        )}
        {/* 标签过滤器标签 */}
        {current.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full border border-border-subtle bg-card/70 text-xs uppercase tracking-[0.3em]"
          >
            {tag}  {/* 显示标签名称 */}
            <button
              type="button"
              onClick={() => handleTagToggle(tag)}  
              className="ml-2"
              aria-label={`Remove ${tag}`}  
            >
              <X className="size-3" />  {/* 关闭图标 */}
            </button>
          </Badge>
        ))}
        {/* 搜索词过滤器标签 */}
        {current.q && (
          <Badge
            variant="outline"
            className="rounded-full border border-border-subtle text-xs uppercase tracking-[0.3em]"
          >
            Search: {current.q}  {/* 显示搜索词 */}
            <button
              type="button"
              onClick={() => {
                const { href } = updatePostsQuery(searchParams, { next: { q: undefined } });
                if (href) router.push(href);
              }}
              className="ml-2"
              aria-label="Remove search" 
            >
              <X className="size-3" />  {/* 关闭图标 */}
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}