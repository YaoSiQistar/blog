import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import SearchHeader from "@/components/search/SearchHeader";
import SearchWorkbench from "@/components/search/SearchWorkbench";
import SearchWelcome from "@/components/search/SearchWelcome";
import SearchEmpty from "@/components/search/SearchEmpty";
import SearchResults from "@/components/search/SearchResults";
import KintsugiResultRail from "@/components/search/KintsugiResultRail";
import PostsPagination from "@/components/pagination/Pagination";

import { getAllCategories, getAllTags, getAllPosts } from "@/lib/content";
import { parseSearchParams, buildSearchHref } from "@/lib/search/query";
import { searchPosts } from "@/lib/search/searchPosts";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const state = parseSearchParams(resolvedSearchParams);
  const [categories, tags] = await Promise.all([getAllCategories(), getAllTags()]);
  const hasQuery = Boolean(state.q?.trim());
  const posts = hasQuery ? await getAllPosts() : [];
  const results = hasQuery ? searchPosts(posts, state) : null;
  const transitionKey = `${state.q ?? ""}-${state.page}-${state.sort}-${state.scope}-${state.category ?? ""}-${state.tags.join(",")}`;

  return (
    <main className="space-y-(--section-y) py-(--section-y)">
      <Container variant="wide" className="space-y-6">
        <SearchHeader
          query={state.q}
          total={results?.total ?? 0}
          sort={state.sort}
          scope={state.scope}
        />
        <RuleLine />
        <SearchWorkbench categories={categories} tags={tags} />
      </Container>

      <Container variant="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {hasQuery ? (
              results && results.total > 0 ? (
                <>
                  <div className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/70">
                    {results.total} results
                    {typeof results.elapsedMs === "number" ? ` - ${results.elapsedMs}ms` : ""}
                  </div>
                  <SearchResults
                    items={results.items}
                    query={state.q ?? ""}
                    page={results.page}
                    pageSize={results.pageSize}
                    transitionKey={transitionKey}
                  />
                  <div className="pt-4">
                    <PostsPagination
                      currentPage={results.page}
                      totalPages={results.totalPages}
                      createHref={(page) => buildSearchHref({ ...state, page })}
                    />
                  </div>
                </>
              ) : (
                <SearchEmpty query={state.q ?? ""} state={state} />
              )
            ) : (
              <SearchWelcome tags={tags} categories={categories} />
            )}
          </div>

          <aside className="hidden space-y-6 lg:block">
            {hasQuery && results && results.total > 0 ? (
              <div className="lg:sticky lg:top-27">
                <KintsugiResultRail
                  items={results.items}
                  total={results.total}
                  page={results.page}
                  totalPages={results.totalPages}
                />
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </main>
  );
}
