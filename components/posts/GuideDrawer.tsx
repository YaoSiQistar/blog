"use client";

import { Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import MuseumGuidePanel from "./MuseumGuidePanel";

// 定义导航项类型，包含slug和数量
type GuideItem = { slug: string; count: number };

// 定义导航抽屉组件的属性类型
type GuideDrawerProps = {
  categories: GuideItem[];  // 分类数组
  tags: GuideItem[];        // 标签数组
};

// 导航抽屉组件 - 用于显示分类和标签的抽屉式导航
// 提供一个可展开的抽屉界面，展示文章分类和标签列表
export default function GuideDrawer({ categories, tags }: GuideDrawerProps) {
  return (
    <Drawer>
      {/* 抽屉触发器 - 点击按钮打开抽屉 */}
      <DrawerTrigger asChild>
        <Button variant="secondary" className="rounded-full">
          <Map className="mr-2 size-4" /> 导览  {/* 地图图标和文字 */}
        </Button>
      </DrawerTrigger>
      {/* 抽屉内容区域 */}
      <DrawerContent className="p-4">
        {/* 抽屉头部，包含标题 */}
        <DrawerHeader>
          <DrawerTitle>展厅导览</DrawerTitle>  {/* 抽屉标题 */}
        </DrawerHeader>
        {/* 抽屉主体内容区域 */}
        <div className="px-2 pb-6">
          {/* 博物馆导航面板组件，传入分类和标签数据 */}
          <MuseumGuidePanel categories={categories} tags={tags} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
