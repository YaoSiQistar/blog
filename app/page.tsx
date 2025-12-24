import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import InkReveal from "@/components/atmosphere/InkReveal";
import KintsugiLine from "@/components/atmosphere/KintsugiLine";
import HomeHeroUltra from "@/components/home/HomeHeroUltra";
import HomeLatestUltra from "@/components/home/HomeLatestUltra";
import HomeGalleries from "@/components/home/HomeGalleries";
import HomeFooterNote from "@/components/home/HomeFooterNote";
import { getAllCategories, getAllTags, getPostsPaged } from "@/lib/content";

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

  return (
    <main className="relative">
      <PaperAtmosphere />
      <InkReveal />
      <KintsugiLine sectionIds={["hero", "latest", "galleries", "footer"]} />
      <HomeHeroUltra />
      <HomeLatestUltra items={listItems} />
      <HomeGalleries categories={categories} tags={tags} />
      <HomeFooterNote />
    </main>
  );
}
