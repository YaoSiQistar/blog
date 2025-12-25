import Slugger from "github-slugger";

export function createSlugger() {
  return new Slugger();
}

export function slugifyText(text: string, slugger: Slugger) {
  return slugger.slug(text);
}
