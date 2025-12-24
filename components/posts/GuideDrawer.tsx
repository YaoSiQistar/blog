"use client";

import { Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import MuseumGuidePanel from "./MuseumGuidePanel";

type GuideItem = { slug: string; count: number };

type GuideDrawerProps = {
  categories: GuideItem[];
  tags: GuideItem[];
};

export default function GuideDrawer({ categories, tags }: GuideDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="rounded-full">
          <Map className="mr-2 size-4" /> Guide
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>Gallery Guide</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 pb-6">
          <MuseumGuidePanel categories={categories} tags={tags} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
