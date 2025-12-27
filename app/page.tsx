import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import InkReveal from "@/components/atmosphere/InkReveal";
import HomeHeroUltra from "@/components/home/HomeHeroUltra";
import HomeLatestUltra from "@/components/home/HomeLatestUltra";
import HomeGalleries from "@/components/home/HomeGalleries";
import HomeFooterNote from "@/components/home/HomeFooterNote";
import { KintsugRail } from "@/components/Kintsug/KintsugiRail";
import { getAllCategories, getAllTags, getPostsPaged } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/og";

export const metadata = buildPageMetadata({
  title: "首页",
  description: "带有电影感动效的暖纸质感博客。",
  pathname: "/",
});

export default async function Home() {
  const [latest, categories, tags] = await Promise.all([
    getPostsPaged({ pageSize: 8 }),
    getAllCategories(),
    getAllTags(),
  ]);

  const listItems = latest.items.map((item) => ({
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    date: item.date,
    readingTime: item.readingTime,
    tags: item.tags,
    cover: item.cover,
  }));

  const herokintsugNodes = [
    {
      id: "module-hero",
      label: "序章",
      kind: "module",
      target: { type: "scroll", selector: "#hero" },
      meta: { subtitle: "入口" },
    },
    {
      id: "module-latest",
      label: "最新",
      kind: "module",
      target: { type: "scroll", selector: "#latest" },
      meta: { subtitle: "目录" },
    },
    {
      id: "module-galleries",
      label: "馆藏",
      kind: "module",
      target: { type: "scroll", selector: "#galleries" },
      meta: { subtitle: "厅室" },
    },
    {
      id: "module-footer",
      label: "编者札记",
      kind: "module",
      target: { type: "scroll", selector: "#footer" },
      meta: { subtitle: "收束" },
    },
  ] as const;

  return (
    <main className="relative">
      <PaperAtmosphere />
      <InkReveal />
      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-6 lg:pl-[280px]">
        <div id="home-content" className="space-y-(--section-y)">
          <HomeHeroUltra />
          <HomeLatestUltra items={listItems} />
          <HomeGalleries categories={categories} tags={tags} />
          <HomeFooterNote />
        </div>
      </div>
      <div className="pointer-events-none fixed left-6 top-0 hidden h-full lg:flex lg:items-center">
        <div className="pointer-events-auto">
          <KintsugRail nodes={herokintsugNodes} mode="hero" containerSelector="#home-content" />
        </div>  
      </div>
    </main>
  );
}
