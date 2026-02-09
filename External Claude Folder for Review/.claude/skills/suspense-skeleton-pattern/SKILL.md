---
name: suspense-skeleton-pattern
description: Ensures proper loading state patterns for React components. Auto-applies when creating page components or async data-fetching components.
allowed-tools:
  - Read
  - Glob
  - Edit
---

# Suspense & Skeleton Pattern

This skill ensures consistent loading state handling across the dashboard.

## Architecture Overview (Updated Jan 2025)

We use a **hybrid SSR + client cache** approach for instant navigation:

| Layer                                 | Purpose                                     |
| ------------------------------------- | ------------------------------------------- |
| **SSR Preloading**                    | First page load renders instantly with data |
| **ConvexQueryCacheProvider**          | Keeps subscriptions alive across navigation |
| **No loading.tsx on preloaded pages** | Prevents skeleton flash during server async |

### Why This Pattern?

- **Linear/Vercel-style instant navigation** - Return visits load from cache
- **Convex real-time updates** - Data stays fresh via WebSocket subscriptions
- **No skeleton flashes** - Data is cached client-side after first visit

## The Preferred Pattern: SSR Preloading + Query Cache

### 1. Server Component (Page)

```typescript
// page.tsx (Server Component)
import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "@/lib/convex/preload";
import { requireOrganizationAccess } from "@/lib/workos/organizationAccess";

export default async function ContactsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { organization } = await requireOrganizationAccess(slug);

  // Preload ALL data in parallel for zero-skeleton navigation
  const [preloadedContacts, preloadedTags] = await Promise.all([
    preloadWithAuth(api.contacts.queries.listContactsWithTags, {
      organizationId: organization._id,
      limit: 1000,
    }),
    preloadWithAuth(api.contacts.queries.listTags, {
      organizationId: organization._id,
    }),
  ]);

  return (
    <ContactList
      preloadedContacts={preloadedContacts}
      preloadedTags={preloadedTags}
    />
  );
}
```

### 2. Client Component

```typescript
// ContactList.tsx
"use client";

import { usePreloadedQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import type { api } from "@/convex/_generated/api";

interface ContactListProps {
  preloadedContacts: Preloaded<typeof api.contacts.queries.listContactsWithTags>;
  preloadedTags: Preloaded<typeof api.contacts.queries.listTags>;
}

export function ContactList({ preloadedContacts, preloadedTags }: ContactListProps) {
  // usePreloadedQuery: Instant render with SSR data + real-time subscriptions
  const contacts = usePreloadedQuery(preloadedContacts);
  const tags = usePreloadedQuery(preloadedTags);

  // No loading check needed - data is always available!
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <ContactCard key={contact._id} contact={contact} tags={tags} />
      ))}
    </div>
  );
}
```

### 3. NO loading.tsx for Preloaded Pages

**IMPORTANT**: Do NOT create `loading.tsx` files for pages that use SSR preloading.

```
CORRECT:
  org/[slug]/contacts/page.tsx     ✓ Uses preloadWithAuth
  org/[slug]/contacts/loading.tsx  ✗ DELETE or rename to .disabled

WHY: loading.tsx shows during server async (preloadWithAuth),
     causing skeleton flash even though data will be ready.
```

## Query Cache Configuration

The `ConvexQueryCacheProvider` in `ConvexClientProvider.tsx` keeps queries cached:

```typescript
// ConvexClientProvider.tsx
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

<ConvexProviderWithAuth client={convex} useAuth={useCustomAuth}>
  {/* Query cache: 5 min TTL, max 250 entries */}
  <ConvexQueryCacheProvider expiration={300000} maxIdleEntries={250}>
    {children}
  </ConvexQueryCacheProvider>
</ConvexProviderWithAuth>
```

**How it works:**

1. User visits Contacts → SSR preload → instant render
2. User navigates to Texts → Contacts subscription stays in cache (5 min)
3. User returns to Contacts → Cache hit → **instant render** (no server call)

## When to Use Skeletons (Client-Only Pages)

For pages WITHOUT SSR preloading (rare), use the traditional pattern:

```typescript
// ClientOnlyComponent.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ComponentSkeleton } from "./ComponentSkeleton";

export function ClientOnlyComponent({ organizationId }: { organizationId: string }) {
  const data = useQuery(api.data.getData, { organizationId });

  // Convex returns undefined while loading
  if (data === undefined) {
    return <ComponentSkeleton />;
  }

  // Empty state
  if (data.length === 0) {
    return <EmptyState />;
  }

  return <DataList data={data} />;
}
```

## Skeleton Design Rules

When skeletons ARE needed, they must match the real layout:

### Match Component Structure

```typescript
// CORRECT - Matches actual layout
<div className="flex items-center gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />  {/* Avatar shape */}
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />  {/* Name width */}
    <Skeleton className="h-3 w-[150px]" />  {/* Email width */}
  </div>
</div>

// WRONG - Generic rectangles
<div>
  <Skeleton className="h-20 w-full" />
</div>
```

### Table Skeletons

```typescript
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          <TableHead><Skeleton className="h-4 w-32" /></TableHead>
          <TableHead><Skeleton className="h-4 w-24" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Decision Tree: Which Pattern to Use?

```
Is this a main dashboard page (contacts, texts, forms, etc.)?
├─ YES → Use SSR Preloading Pattern
│        - preloadWithAuth in page.tsx
│        - usePreloadedQuery in client component
│        - NO loading.tsx file
│
└─ NO → Is this a modal, dialog, or secondary view?
        ├─ YES → Use Client-Only Pattern
        │        - useQuery directly
        │        - Show skeleton while loading
        │
        └─ NO → Use SSR Preloading Pattern (default)
```

## Validation Checklist

Before completing UI work:

- [ ] Using SSR preloading for main pages?
- [ ] All related queries preloaded in parallel with `Promise.all`?
- [ ] Client component uses `usePreloadedQuery`?
- [ ] NO `loading.tsx` file for preloaded pages?
- [ ] If skeleton needed, does it match real component layout?
- [ ] Empty state handled (`data.length === 0`)?

## Reference Files

- **Preload helper**: `apps/dashboard/src/lib/convex/preload.ts`
- **Query cache provider**: `apps/dashboard/src/app/ConvexClientProvider.tsx`
- **Example preloaded page**: `apps/dashboard/src/app/(dashboard)/org/[slug]/contacts/page.tsx`
- **Skeleton component**: `apps/dashboard/src/components/ui/skeleton.tsx`

## Common Mistakes to Avoid

### 1. Creating loading.tsx for preloaded pages

```typescript
// DON'T DO THIS for pages with SSR preloading
// org/[slug]/contacts/loading.tsx ← DELETE THIS
```

### 2. Using useQuery instead of usePreloadedQuery

```typescript
// WRONG - Ignores SSR preloaded data, shows loading state
const data = useQuery(api.data.get, { id });

// CORRECT - Uses SSR data immediately
const data = usePreloadedQuery(preloadedData);
```

### 3. Not preloading all required data

```typescript
// WRONG - Only preloads contacts, tags loaded client-side (flash!)
const preloadedContacts = await preloadWithAuth(...);
// tags uses useQuery in component = skeleton flash

// CORRECT - Preload everything in parallel
const [preloadedContacts, preloadedTags] = await Promise.all([
  preloadWithAuth(api.contacts.queries.listContactsWithTags, {...}),
  preloadWithAuth(api.contacts.queries.listTags, {...}),
]);
```
