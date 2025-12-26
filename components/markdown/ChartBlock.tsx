"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

type ChartSpec = {
  type: "bar" | "line" | "area";
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: Array<{ key: string; label?: string; color?: string }>;
};

type ChartBlockProps = {
  spec: string;
  className?: string;
};

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function ChartBlock(props?: ChartBlockProps | null) {
  const safeProps = props ?? { spec: "" };
  const { spec = "", className } = safeProps;
  const { chart, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(spec) as ChartSpec;
      return { chart: parsed, error: null };
    } catch (err) {
      return { chart: null, error: err instanceof Error ? err.message : "Invalid chart spec" };
    }
  }, [spec]);

  if (!chart || error) {
    return (
      <div className={cn("markdown-chart", className)}>
        <pre className="markdown-chart-error">{error ?? "Invalid chart"}</pre>
      </div>
    );
  }

  const { type, data, xKey, series } = chart;

  return (
    <div className={cn("markdown-chart", className)}>
      <ResponsiveContainer width="100%" height={320}>
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ borderRadius: 12 }} />
            <Legend />
            {series.map((item, index) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.label ?? item.key}
                fill={item.color ?? colors[index % colors.length]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        ) : type === "area" ? (
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ borderRadius: 12 }} />
            <Legend />
            {series.map((item, index) => (
              <Area
                key={item.key}
                dataKey={item.key}
                name={item.label ?? item.key}
                fill={item.color ?? colors[index % colors.length]}
                stroke={item.color ?? colors[index % colors.length]}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ borderRadius: 12 }} />
            <Legend />
            {series.map((item, index) => (
              <Line
                key={item.key}
                dataKey={item.key}
                name={item.label ?? item.key}
                stroke={item.color ?? colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
