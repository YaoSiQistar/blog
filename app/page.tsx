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
  title: "Home",
  description: "A warm paper editorial journal with cinematic motion notes.",
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
      label: "Hero",
      kind: "module",
      target: { type: "scroll", selector: "#hero" },
      meta: { subtitle: "Entrance" },
    },
    {
      id: "module-latest",
      label: "Latest",
      kind: "module",
      target: { type: "scroll", selector: "#latest" },
      meta: { subtitle: "Catalog" },
    },
    {
      id: "module-galleries",
      label: "Galleries",
      kind: "module",
      target: { type: "scroll", selector: "#galleries" },
      meta: { subtitle: "Rooms" },
    },
    {
      id: "module-footer",
      label: "Curator note",
      kind: "module",
      target: { type: "scroll", selector: "#footer" },
      meta: { subtitle: "Closing" },
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
