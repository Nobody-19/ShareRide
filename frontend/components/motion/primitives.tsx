"use client";

import { motion, AnimatePresence, type Variants } from "motion/react";

export { motion, AnimatePresence };

/** Short, snappy defaults — nothing here runs past ~220ms. */
export const EASE = [0.2, 0, 0, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15, ease: EASE } },
};

export const stagger = (delay = 0.045): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.16, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.12, ease: EASE } },
};

export const sheetUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.14, ease: EASE } },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/** Reveal-on-mount wrapper for a list of children with a stagger. */
export function StaggerGroup({
  children,
  className,
  delay = 0.045,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div className={className} initial="hidden" animate="show" variants={stagger(delay)}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
