import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  createHref: (page: number) => string;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export default function PostsPagination({
  currentPage,
  totalPages,
  createHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const siblings = 1;
  const pages = new Set<number>([1, totalPages]);

  range(Math.max(1, safePage - siblings), Math.min(totalPages, safePage + siblings)).forEach(
    (page) => pages.add(page)
  );

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const showLeftEllipsis = sortedPages[1] > 2;
  const showRightEllipsis = sortedPages[sortedPages.length - 2] < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={createHref(Math.max(1, safePage - 1))} />
        </PaginationItem>
        {sortedPages.map((page, index) => {
          const prev = sortedPages[index - 1];
          const needsGap = prev && page - prev > 1;

          return (
            <PaginationItem key={page}>
              {needsGap && (prev === 1 ? showLeftEllipsis : showRightEllipsis) ? (
                <PaginationEllipsis />
              ) : null}
              <PaginationLink href={createHref(page)} isActive={page === safePage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext href={createHref(Math.min(totalPages, safePage + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
