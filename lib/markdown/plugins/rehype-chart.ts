import type { Root, Element } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

const isChartBlock = (node: Element) => {
  if (node.tagName !== "code") return false;
  const className = node.properties?.className;
  if (!Array.isArray(className)) return false;
  return className.some((value) => typeof value === "string" && value.includes("language-chart"));
};

const isDataTableBlock = (node: Element) => {
  if (node.tagName !== "code") return false;
  const className = node.properties?.className;
  if (!Array.isArray(className)) return false;
  return className.some((value) =>
    typeof value === "string" && (value.includes("language-csv") || value.includes("language-json-table"))
  );
};

const buildTable = (raw: string, kind: "csv" | "json-table"): Element => {
  let rows: string[][] = [];
  if (kind === "csv") {
    rows = raw
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(",").map((cell) => cell.trim()));
  } else {
    try {
      const parsed = JSON.parse(raw) as Array<Record<string, string | number>>;
      const keys = parsed.length ? Object.keys(parsed[0]) : [];
      rows = [keys, ...parsed.map((row) => keys.map((key) => String(row[key] ?? "")))];
    } catch {
      rows = [["Invalid JSON table"]];
    }
  }

  const [headings, ...body] = rows;
  return {
    type: "element" as const,
    tagName: "table",
    properties: {
      "data-table-source": kind,
    },
    children: [
      {
        type: "element" as const,
        tagName: "thead",
        properties: {},
        children: [
          {
            type: "element" as const,
            tagName: "tr",
            properties: {},
            children: (headings ?? []).map((cell) => ({
              type: "element" as const,
              tagName: "th",
              properties: {},
              children: [{ type: "text", value: cell }],
            })),
          },
        ],
      },
      {
        type: "element" as const,
        tagName: "tbody",
        properties: {},
        children: body.map((row) => ({
          type: "element" as const,
          tagName: "tr",
          properties: {},
          children: row.map((cell) => ({
            type: "element" as const,
            tagName: "td",
            properties: {},
            children: [{ type: "text", value: cell }],
          })),
        })),
      },
    ],
  };
};

export const rehypeChart: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || typeof index !== "number") return;
      if (node.tagName !== "pre") return;
      const code = node.children?.[0];
      if (!code || code.type !== "element") return;

      if (isChartBlock(code)) {
        const raw = toString(code).trim();
        parent.children[index] = {
          type: "element",
          tagName: "ChartBlock",
          properties: {
            spec: raw,
            className: "",
          },
          children: [],
        };
        return;
      }

      if (isDataTableBlock(code)) {
        const props = code.properties || {}; // 确保 props 存在
        const className = Array.isArray(props.className) ? props.className : [];
        const kind = className.some((value) => typeof value === "string" && value.includes("language-csv"))
          ? "csv"
          : "json-table";
        const raw = toString(code).trim();
        parent.children[index] = buildTable(raw, kind);
      }
    });
  };
};
