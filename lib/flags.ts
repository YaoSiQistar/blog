import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export interface MotionFlags {
  cinema: boolean;
  reduced: boolean;
}

const parseFlag = (value: string | null) => value === "1" || value === "true";

export function parseMotionFlags(
  params: Record<string, string | string[] | undefined>
): MotionFlags {
  const getValue = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] : raw ?? null;
  };

  return {
    cinema: parseFlag(getValue("cinema")),
    reduced: parseFlag(getValue("reduced")),
  };
}

export function useMotionFlags(): MotionFlags {
  const params = useSearchParams();

  return useMemo(() => {
    if (!params) {
      return { cinema: false, reduced: false };
    }
    return {
      cinema: parseFlag(params.get("cinema")),
      reduced: parseFlag(params.get("reduced")),
    };
  }, [params]);
}
