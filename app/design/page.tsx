import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Container from "@/components/shell/Container";
import PageHeader from "@/components/shell/PageHeader";
import CatalogList, {
  type CatalogPost,
} from "@/components/catalog/CatalogList";
import { RuleLine } from "@/components/editorial/RuleLine";
import Kicker from "@/components/editorial/Kicker";

const colorTokens = [
  { name: "--background", label: "Canvas", detail: "Base warm paper." },
  { name: "--card", label: "Cards", detail: "Raised editorial surfaces." },
  { name: "--primary", label: "Primary accent", detail: "Deep indigo highlight." },
  { name: "--secondary", label: "Secondary accent", detail: "Soft parchment hue." },
  { name: "--muted", label: "Muted text", detail: "Metadata and captions." },
  { name: "--border", label: "Dividers", detail: "Ultra subtle lines." },
  { name: "--destructive", label: "Warnings", detail: "Alert actions." },
  { name: "--ring", label: "Focus / ghost", detail: "Halo around links & inputs." },
];

const layoutTokens = [
  {
    label: "Container (wide)",
    value: "var(--container-wide)",
    detail: "Catalog and IA pages.",
  },
  {
    label: "Container (prose)",
    value: "var(--container-prose)",
    detail: "Article reading width.",
  },
  {
    label: "Gutter",
    value: "var(--gutter)",
    detail: "Horizontal padding for sections.",
  },
  {
    label: "Section gap",
    value: "var(--section-y)",
    detail: "Vertical rhythm between sections.",
  },
  {
    label: "Radius",
    value: "var(--radius)",
    detail: "Rounded corners for panels.",
  },
];

const paperTokens = [
  { label: "Noise opacity", value: "var(--paper-noise-opacity)" },
  { label: "Vignette", value: "var(--paper-vignette-opacity)" },
  { label: "Drift", value: "var(--paper-drift-intensity)" },
  { label: "Sheen", value: "var(--glass-sheen-opacity)" },
  { label: "Emboss", value: "var(--emboss-opacity)" },
];

const catalogSamples: CatalogPost[] = [
  {
    title: "Cataloging warm light and editorial tone",
    slug: "cataloging-warm-light",
    excerpt:
      "A design manifesto for the warm-paper web, balancing Catalog Lists with editorial grids.",
    category: "Notes",
    date: "Dec 24, 2025",
    readingTime: "8 min read",
  },
  {
    title: "Soft gradients for strong hierarchy",
    slug: "soft-gradients",
    excerpt:
      "How to map editorial typography into Next.js components with measured spacing.",
    category: "Studio",
    date: "Dec 18, 2025",
    readingTime: "11 min read",
  },
  {
    title: "Paper texture in motion",
    slug: "paper-texture",
    excerpt:
      "Pairing Framer Motion transitions with radial gradients and noise overlays.",
    category: "Motion",
    date: "Dec 12, 2025",
    readingTime: "6 min read",
  },
];

function ColorSwatch({
  token,
  label,
  detail,
}: {
  token: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius)] border border-border-subtle bg-card/60 px-4 py-3">
      <span
        className="h-12 w-12 rounded-full border border-border bg-[color:var(--card)]"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div>
        <p className="text-sm font-semibold leading-tight text-foreground">{label}</p>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
          {token}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80">{detail}</p>
      </div>
    </div>
  );
}

function LayoutTokenItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[var(--radius)] border border-border-subtle bg-card/70 px-4 py-3 text-sm">
      <span className="text-base font-semibold text-foreground">{label}</span>
      <span className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
        {value}
      </span>
      {detail && (
        <span className="text-xs text-muted-foreground/80">{detail}</span>
      )}
    </div>
  );
}

export default function DesignPage() {
  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide">
        <PageHeader
          label="Design system"
          title="Editorial tokens + warm paper"
          description="Tokens, typography, catalog list styling, and component previews that anchor the journalistic tone."
          actions={
            <>
              <Button variant="secondary" size="sm">
                Download tokens
              </Button>
              <Button variant="ghost" size="sm">
                Motion tokens
              </Button>
            </>
          }
        />

        <RuleLine className="my-8" />

        <section className="grid gap-5 md:grid-cols-2">
          {colorTokens.map((token) => (
            <ColorSwatch
              key={token.name}
              token={token.name}
              label={token.label}
              detail={token.detail}
            />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Kicker label="Layout" caption="Grid" />
            <div className="grid gap-3 md:grid-cols-2">
              {layoutTokens.map((item) => (
                <LayoutTokenItem key={item.label} {...item} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Kicker label="Paper + light" caption="Textures" />
            <div className="grid gap-3">
              {paperTokens.map((token) => (
                <LayoutTokenItem
                  key={token.label}
                  label={token.label}
                  value={token.value}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Typography" caption="Text systems" />
            <p className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
              A journalistic tone with measured cadence.
            </p>
            <p className="font-serif text-lg text-muted-foreground">
              Inter for UI, Noto Serif SC for prose, and JetBrains Mono for code
              create a clear hierarchy. Headings sit wide, paragraphs breathe,
              and metadata stays calm.
            </p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.5em] text-muted-foreground">
              <span>Prose width: 60-72ch</span>
              <span>Line-height: 1.75+</span>
              <span>Paragraph spacing {">"}=0.9em</span>
            </div>
          </div>

          <div className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Components" caption="shadcn/ui" />
            <Card className="space-y-4 bg-card/80">
              <CardHeader className="space-y-1">
                <CardTitle>Field kit</CardTitle>
                <CardDescription>
                  Buttons, inputs, badges, selects, and popovers inherit tokens
                  automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Input placeholder="Search catalog" aria-label="Search" />
                  <Select defaultValue="catalog">
                    <SelectTrigger>
                      <SelectValue placeholder="Collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="catalog">Catalog</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Fresh</Badge>
                  <Badge variant="secondary">Editorial</Badge>
                  <Badge variant="outline">Muted</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Popover
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                      DETAILS
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Motion-ready tokens inherit the same palette.
                    </p>
                  </PopoverContent>
                </Popover>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <Kicker label="Catalog list" caption="Catalog" />
          <CatalogList items={catalogSamples} />
        </section>
      </Container>
    </main>
  );
}
