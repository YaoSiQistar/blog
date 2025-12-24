"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends React.ComponentProps<typeof Link> {
  underlineThickness?: number;
  underlineOffset?: number;
}

const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  (
    {
      children,
      className,
      underlineThickness,
      underlineOffset,
      ...props
    },
    ref
  ) => {
    const isReduced = useReducedMotion();
    const flags = useMotionFlags();
    const reduced = isReduced || flags.reduced;
    const thickness =
      underlineThickness ?? motionTokens.underline.thickness;
    const offset = underlineOffset ?? motionTokens.underline.offset;

    return (
      <Link
        {...props}
        ref={ref}
        className={cn("relative inline-flex items-center gap-1 text-current", className)}
      >
        <span>{children}</span>
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute left-0 right-0 bottom-0 origin-left bg-current"
            style={{
              height: thickness,
              bottom: offset,
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            whileFocus={{ scaleX: 1 }}
            transition={{
              duration: motionTokens.durations.fast,
              ease: motionTokens.easing.easeInOut,
            }}
          />
        )}
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";

export default AnimatedLink;
