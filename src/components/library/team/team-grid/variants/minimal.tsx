"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TeamMember } from "../team-grid.types";
import { AvatarFallback } from "../shared";

export function MinimalMember({
  member,
  index,
  animate,
  isInView,
}: {
  member: TeamMember;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Circular image */}
      <div
        className="relative h-24 w-24 overflow-hidden"
        style={{ borderRadius: "var(--radius-full)" }}
      >
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <AvatarFallback name={member.name} size="circle" />
        )}
      </div>

      {/* Name */}
      <h3
        className="mt-4"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-semibold)",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-text)",
        }}
      >
        {member.name}
      </h3>

      {/* Role */}
      <p
        className="mt-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-normal)",
          color: "var(--color-text-secondary)",
        }}
      >
        {member.role}
      </p>
    </motion.div>
  );
}
