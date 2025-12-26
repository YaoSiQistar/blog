"use client";

import { motion } from "motion/react";

import ProfilePlaque from "@/components/about/ProfilePlaque";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";

type AboutHeroProps = {
  title: string;
  subtitle: string;
  name?: string;
  avatar?: string;
  role?: string;
  location?: string;
  now?: string;
  email?: string;
  links?: Array<{ label: string; url: string }>;
};

export default function AboutHero({
  title,
  subtitle,
  name,
  avatar,
  role,
  location,
  now,
  email,
  links,
}: AboutHeroProps) {
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { duration: motionTokens.durations.normal, ease: motionTokens.easing.easeOut };

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="space-y-4">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={transition}
          className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground/70"
        >
          About
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduced ? 0 : 0.05 }}
          className="font-serif text-4xl tracking-tight text-foreground md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduced ? 0 : 0.1 }}
          className="max-w-[42ch] text-base text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ ...transition, delay: reduced ? 0 : 0.08 }}
      >
        <ProfilePlaque
          name={name}
          avatar={avatar}
          role={role}
          location={location}
          now={now}
          email={email}
          links={links}
        />
      </motion.div>
    </section>
  );
}
