"use client";

import { motion } from "framer-motion";

interface MotionFadeProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
}

export function MotionFade({
  children,
  className,
  y = 20,
  delay = 0,
  duration = 0.6,
}: MotionFadeProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
