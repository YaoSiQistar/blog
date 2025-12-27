import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import InkReveal from "@/components/atmosphere/InkReveal";
import HomeHeroUltra from "@/components/home/HomeHeroUltra";
import HomeLatestUltra from "@/components/home/HomeLatestUltra";
import HomeGalleries from "@/components/home/HomeGalleries";
import HomeFooterNote from "@/components/home/HomeFooterNote";
import { KintsugRail } from "@/components/Kintsug/KintsugiRail";
import SceneChapters from "@/components/motion/SceneChapters";
import MotionExitSigns from "@/components/motion/MotionExitSigns";
import { getAllCategories, getAllTags, getPostsPaged } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/og";
import { heroScenes } from "@/app/home/_data/heroScenes";

export const metadata = buildPageMetadata({
  title: "Home",
  description: "A quiet editorial archive with curated motion.",
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

  const scenes = heroScenes.map((scene) => ({
    id: scene.id,
    kicker: scene.kicker,
    title: scene.headline,
    description: scene.body,
  }));

  const herokintsugNodes = [
    {
      id: "module-hero",
      label: "Opening",
      kind: "module",
      target: { type: "scroll", selector: "#hero" },
      meta: { subtitle: "Entrance" },
    },
    {
      id: "module-scenes",
      label: "Chapters",
      kind: "module",
      target: { type: "scroll", selector: "#home-scenes" },
      meta: { subtitle: "Narrative" },
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
      label: "Exit",
      kind: "module",
      target: { type: "scroll", selector: "#footer" },
      meta: { subtitle: "Close" },
    },
  ] as const;

  return (
    <main className="relative">
      <PaperAtmosphere />
      <InkReveal />
      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-6 lg:pl-[280px]">
        <div id="home-content" className="space-y-(--section-y)">
          <HomeHeroUltra />
          <section id="home-scenes">
            <SceneChapters scenes={scenes} />
          </section>
          <HomeLatestUltra items={listItems} />
          <HomeGalleries categories={categories} tags={tags} />
          <HomeFooterNote />
          <MotionExitSigns />
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