"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { BlogPreviewProps, BlogPost } from "./blog-preview.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function PostImageArea({
  post,
  aspectRatio = "aspect-[16/10]",
  borderRadius,
}: {
  post: BlogPost;
  aspectRatio?: string;
  borderRadius: string;
}): React.ReactElement {
  const hasImage = post.image?.src;

  return (
    <div className={cn("relative w-full overflow-hidden", aspectRatio)} style={{ borderRadius }}>
      {hasImage ? (
        <Image
          src={post.image!.src}
          alt={post.image!.alt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          {...(post.image!.blurDataURL
            ? { placeholder: "blur", blurDataURL: post.image!.blurDataURL }
            : {})}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-surface) 100%)`,
            opacity: 0.15,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {post.category ?? "Blog"}
          </span>
        </div>
      )}
      {/* Category badge overlay */}
      {post.category && (
        <div
          className="absolute top-3 left-3 px-3 py-1"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "0.02em",
          }}
        >
          {post.category}
        </div>
      )}
    </div>
  );
}

function PostMeta({
  post,
  showDate,
  showAuthor,
}: {
  post: BlogPost;
  showDate: boolean;
  showAuthor: boolean;
}): React.ReactElement | null {
  const items: React.ReactNode[] = [];

  if (showDate && post.date) {
    items.push(
      <span key="date" className="inline-flex items-center gap-1.5">
        <Calendar size={13} />
        {post.date}
      </span>
    );
  }

  if (showAuthor && post.author) {
    items.push(
      <span key="author" className="inline-flex items-center gap-1.5">
        <User size={13} />
        {post.author}
      </span>
    );
  }

  if (post.readTime) {
    items.push(
      <span key="readTime" className="inline-flex items-center gap-1.5">
        <Clock size={13} />
        {post.readTime}
      </span>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        color: "var(--color-text-secondary)",
      }}
    >
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          {item}
          {i < items.length - 1 && (
            <span
              className="ml-3 inline-block h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card Grid variant                                                  */
/* ------------------------------------------------------------------ */

function CardGridPost({
  post,
  index,
  animate,
  isInView,
  showDate,
  showAuthor,
  showCategory,
}: {
  post: BlogPost;
  index: number;
  animate: boolean;
  isInView: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showCategory: boolean;
}): React.ReactElement {
  const Wrapper = post.href ? "a" : "div";
  const linkProps = post.href ? { href: post.href, target: "_self" as const } : {};

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Wrapper
        {...linkProps}
        className="group flex h-full flex-col overflow-hidden transition-all"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
          transitionProperty: "transform, box-shadow, border-color",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
          textDecoration: "none",
          color: "inherit",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--color-border-light)";
        }}
      >
        {/* Image area */}
        <PostImageArea
          post={showCategory ? post : { ...post, category: undefined }}
          aspectRatio="aspect-[16/10]"
          borderRadius="0px"
        />

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <PostMeta post={post} showDate={showDate} showAuthor={showAuthor} />

          <h3
            className={showDate || showAuthor || post.readTime ? "mt-3" : ""}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-xl)",
              fontWeight: "var(--weight-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--color-text)",
            }}
          >
            {post.title}
          </h3>

          <p
            className="mt-2 line-clamp-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {post.excerpt}
          </p>

          {/* Read more link */}
          <div
            className="mt-auto flex items-center gap-1.5 pt-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-primary)",
            }}
          >
            Read more
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Row variant                                               */
/* ------------------------------------------------------------------ */

function FeaturedPost({
  post,
  animate,
  isInView,
  showDate,
  showAuthor,
  showCategory,
}: {
  post: BlogPost;
  animate: boolean;
  isInView: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showCategory: boolean;
}): React.ReactElement {
  const Wrapper = post.href ? "a" : "div";
  const linkProps = post.href ? { href: post.href, target: "_self" as const } : {};

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Wrapper
        {...linkProps}
        className="group grid items-center gap-6 overflow-hidden md:grid-cols-2 md:gap-10"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-md)",
          textDecoration: "none",
          color: "inherit",
          transitionProperty: "box-shadow, border-color",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.borderColor = "var(--color-border-light)";
        }}
      >
        {/* Image area */}
        <PostImageArea
          post={showCategory ? post : { ...post, category: undefined }}
          aspectRatio="aspect-[16/10] md:aspect-[4/3]"
          borderRadius="0px"
        />

        {/* Content */}
        <div className="flex flex-col p-5 md:p-8 md:pl-0">
          <PostMeta post={post} showDate={showDate} showAuthor={showAuthor} />

          <h3
            className={showDate || showAuthor || post.readTime ? "mt-3" : ""}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(var(--text-xl), 2.5vw, var(--text-3xl))",
              fontWeight: "var(--weight-bold)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--color-text)",
            }}
          >
            {post.title}
          </h3>

          <p
            className="mt-3 line-clamp-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-lg)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {post.excerpt}
          </p>

          <div
            className="mt-6 flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-primary)",
            }}
          >
            Read article
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

function SmallCardPost({
  post,
  index,
  animate,
  isInView,
  showDate,
  showAuthor,
  showCategory,
}: {
  post: BlogPost;
  index: number;
  animate: boolean;
  isInView: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showCategory: boolean;
}): React.ReactElement {
  const Wrapper = post.href ? "a" : "div";
  const linkProps = post.href ? { href: post.href, target: "_self" as const } : {};

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: 0.15 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Wrapper
        {...linkProps}
        className="group flex h-full flex-col overflow-hidden transition-all"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
          transitionProperty: "transform, box-shadow, border-color",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
          textDecoration: "none",
          color: "inherit",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--color-border-light)";
        }}
      >
        <PostImageArea
          post={showCategory ? post : { ...post, category: undefined }}
          aspectRatio="aspect-[16/10]"
          borderRadius="0px"
        />

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <PostMeta post={post} showDate={showDate} showAuthor={showAuthor} />

          <h4
            className={showDate || showAuthor || post.readTime ? "mt-2" : ""}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-lg)",
              fontWeight: "var(--weight-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--color-text)",
            }}
          >
            {post.title}
          </h4>

          <p
            className="mt-2 line-clamp-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {post.excerpt}
          </p>
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  List variant                                                       */
/* ------------------------------------------------------------------ */

function ListPost({
  post,
  index,
  animate,
  isInView,
  showDate,
  showAuthor,
  showCategory,
}: {
  post: BlogPost;
  index: number;
  animate: boolean;
  isInView: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showCategory: boolean;
}): React.ReactElement {
  const Wrapper = post.href ? "a" : "div";
  const linkProps = post.href ? { href: post.href, target: "_self" as const } : {};

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Wrapper
        {...linkProps}
        className="group flex flex-col gap-4 py-5 transition-all md:flex-row md:gap-6 md:py-6"
        style={{
          borderBottom: "1px solid var(--color-border-light)",
          textDecoration: "none",
          color: "inherit",
          transitionProperty: "background-color",
          transitionDuration: "var(--transition-fast)",
          transitionTimingFunction: "var(--ease-default)",
        }}
      >
        {/* Image area */}
        <div className="w-full flex-shrink-0 md:w-56 lg:w-64">
          <PostImageArea
            post={showCategory ? post : { ...post, category: undefined }}
            aspectRatio="aspect-[16/10]"
            borderRadius="var(--radius-lg)"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <PostMeta post={post} showDate={showDate} showAuthor={showAuthor} />

          <h3
            className={cn(
              "transition-colors duration-200 group-hover:opacity-80",
              showDate || showAuthor || post.readTime ? "mt-2" : ""
            )}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-xl)",
              fontWeight: "var(--weight-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--color-text)",
            }}
          >
            {post.title}
          </h3>

          <p
            className="mt-2 line-clamp-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {post.excerpt}
          </p>

          <div
            className="mt-3 flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-primary)",
            }}
          >
            Read more
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * BlogPreview — preview grid of recent blog posts or articles.
 *
 * Variants:
 *  - "card-grid"     — responsive grid of blog post cards (1/2/3 cols)
 *  - "featured-row"  — first post featured full-width, rest in row below
 *  - "list"          — compact horizontal list layout, stacks on mobile
 */
export function BlogPreview({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  posts,
  variant = "card-grid",
  showDate = true,
  showAuthor = true,
  showCategory = true,
}: BlogPreviewProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  if (posts.length === 0) return <></>;

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline ?? "Blog"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-8 text-center md:mb-16"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline && (
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
                  fontWeight: "var(--weight-bold)",
                  lineHeight: "var(--leading-tight)",
                  letterSpacing: "var(--tracking-tight)",
                  color: "var(--color-text)",
                }}
              >
                {headline}
              </h2>
            )}
            {subheadline && (
              <p
                className="mx-auto mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-lg)",
                  lineHeight: "var(--leading-relaxed)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "640px",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Card Grid variant */}
        {variant === "card-grid" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <CardGridPost
                key={i}
                post={post}
                index={i}
                animate={animate}
                isInView={isInView}
                showDate={showDate}
                showAuthor={showAuthor}
                showCategory={showCategory}
              />
            ))}
          </div>
        )}

        {/* Featured Row variant */}
        {variant === "featured-row" && (
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Featured first post */}
            <FeaturedPost
              post={posts[0]}
              animate={animate}
              isInView={isInView}
              showDate={showDate}
              showAuthor={showAuthor}
              showCategory={showCategory}
            />

            {/* Remaining posts in a row */}
            {posts.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(1).map((post, i) => (
                  <SmallCardPost
                    key={i}
                    post={post}
                    index={i}
                    animate={animate}
                    isInView={isInView}
                    showDate={showDate}
                    showAuthor={showAuthor}
                    showCategory={showCategory}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* List variant */}
        {variant === "list" && (
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <ListPost
                key={i}
                post={post}
                index={i}
                animate={animate}
                isInView={isInView}
                showDate={showDate}
                showAuthor={showAuthor}
                showCategory={showCategory}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
