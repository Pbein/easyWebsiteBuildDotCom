"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TeamMember } from "../team-grid.types";
import { AvatarFallback, SocialIcon } from "../shared";

export function CardsMember({
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
      className="group relative flex flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        transitionProperty: "transform, box-shadow, border-color",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--color-border-light)";
      }}
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden">
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <AvatarFallback name={member.name} size="full" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {member.name}
        </h3>

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

        {member.bio && (
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {member.bio}
          </p>
        )}

        {/* Social links */}
        {member.socials && member.socials.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {member.socials.map((s) => (
              <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
