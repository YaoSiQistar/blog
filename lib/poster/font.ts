import path from "path";
import { promises as fs } from "fs";

export type PosterFont = {
  name: string;
  data: ArrayBuffer;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style?: "normal" | "italic";
};

type LoadedPosterFonts = {
  serif: ArrayBuffer;
  serifBold: ArrayBuffer;
  sans: ArrayBuffer;
  sansBold: ArrayBuffer;
  cjk: ArrayBuffer;
};

const fontPath = (file: string) =>
  path.join(process.cwd(), "public", "fonts", file);

const readFont = async (file: string) => {
  const buffer = await fs.readFile(fontPath(file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};

const loadFonts = (() => {
  let cache: Promise<LoadedPosterFonts> | null = null;
  return async () => {
    if (!cache) {
      cache = (async () => {
        const [serif, serifBold, sans, sansBold, cjk] = await Promise.all([
          readFont("PosterSerif-Regular.ttf"),
          readFont("PosterSerif-Bold.ttf"),
          readFont("PosterSans-Regular.ttf"),
          readFont("PosterSans-Bold.ttf"),
          readFont("PosterCJK-Regular.ttf"),
        ]);

        return { serif, serifBold, sans, sansBold, cjk };
      })();
    }
    return cache;
  };
})();

export async function loadPosterFonts(): Promise<PosterFont[]> {
  const fonts = await loadFonts();
  return [
    { name: "PosterSerif", data: fonts.serif, weight: 400, style: "normal" },
    { name: "PosterSerif", data: fonts.serifBold, weight: 600, style: "normal" },
    { name: "PosterSans", data: fonts.sans, weight: 400, style: "normal" },
    { name: "PosterSans", data: fonts.sansBold, weight: 600, style: "normal" },
    { name: "PosterCJK", data: fonts.cjk, weight: 400, style: "normal" },
  ];
}
