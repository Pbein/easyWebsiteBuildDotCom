"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TeamMember } from "../team-grid.types";
import { AvatarFallback } from "../shared";

export function HoverRevealMember({
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
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: "var(--radius-xl)",
        aspectRatio: "3 / 4",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setRevealed((prev) => !prev)}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <AvatarFallback name={member.name} size="full" />
        )}
      </div>

      {/* Default bottom gradient + name overlay */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          transitionProperty: "opacity",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
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
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {member.role}
        </p>
      </div>

      {/* Hover/tap reveal overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-6",
          "opacity-0 group-hover:opacity-100",
          revealed && "!opacity-100"
        )}
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          transitionProperty: "opacity",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
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
            color: "rgba(255,255,255,0.8)",
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
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {member.bio}
          </p>
        )}

        {/* Social links */}
        {member.socials && member.socials.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {member.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
                style={{
                  width: "var(--text-2xl)",
                  height: "var(--text-2xl)",
                  color: "rgba(255,255,255,0.7)",
                  transitionProperty: "color",
                  transitionDuration: "var(--transition-fast)",
                  transitionTimingFunction: "var(--ease-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`${s.platform} profile`}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-medium)",
                    textTransform: "capitalize",
                  }}
                >
                  {s.platform}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
