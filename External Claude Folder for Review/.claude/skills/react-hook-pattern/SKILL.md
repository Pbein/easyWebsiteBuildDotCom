---
name: react-hook-pattern
description: Ensures consistent React hook structure for Convex integration. Auto-applies when creating or editing files in hooks/ folder or files named use-*.ts.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
---

# React Hook Pattern

This skill ensures consistent React hook structure across the codebase.

## Standard Hook Structure

Every hook should follow this pattern:

```typescript
"use client";

import { useCallback } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/core/use-toast";

/**
 * Hook description - what it does and when to use it.
 *
 * @param organizationId - The organization ID
 * @returns Object with data, loading state, error, and mutation functions
 */
export const useFeatureName = (organizationId: string) => {
  const { toast } = useToast();

  // 1. Query with conditional skip
  const data = useQuery(
    api.domain.queries.listItems,
    organizationId ? { organizationId: organizationId as Id<"organizations"> } : "skip"
  );

  // 2. Transform data if needed
  const transformedData =
    data?.items?.map((item) => ({
      ...item,
      id: item._id, // Compatibility property
    })) || [];

  // 3. Mutation functions with useCallback
  const createItem = useCallback(
    async (input: CreateInput) => {
      try {
        const result = await createItemAction(input);
        toast({ title: "Success", description: "Item created" });
        return result;
      } catch (error) {
        toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
        throw error;
      }
    },
    [toast]
  );

  // 4. Return consistent shape
  return {
    data: transformedData,
    isLoading: data === undefined,
    error: data?.error ? new Error(data.error) : null,
    createItem,
    // ... other mutations
  };
};
```

## Critical Rules

### 1. File Naming

```
CORRECT:
hooks/business/use-campaigns.ts
hooks/auth/use-session.ts
hooks/sms/use-a2p-verification.ts

WRONG:
hooks/useCampaigns.ts        // Wrong casing
hooks/campaigns.ts           // Missing use- prefix
hooks/business/campaigns.ts  // Missing use- prefix
```

### 2. Hook Domain Organization

Place hooks in the correct domain folder:

| Domain        | Path                 | Examples                                  |
| ------------- | -------------------- | ----------------------------------------- |
| `auth`        | `hooks/auth/`        | use-session, use-permissions              |
| `business`    | `hooks/business/`    | use-campaigns, use-contacts, use-billing  |
| `sms`         | `hooks/sms/`         | use-a2p-verification, use-tcpa-validation |
| `core`        | `hooks/core/`        | use-toast, use-pagination                 |
| `ui`          | `hooks/ui/`          | use-theme, use-phone-input                |
| `analytics`   | `hooks/analytics/`   | use-analytics, use-organization-analytics |
| `performance` | `hooks/performance/` | use-campaign-creation-prefetch            |

### 3. Conditional Query Skip

Always use "skip" for undefined organizationId:

```typescript
// CORRECT - Skip query when no org
const data = useQuery(
  api.contacts.queries.listContacts,
  organizationId ? { organizationId: organizationId as Id<"organizations"> } : "skip"
);

// WRONG - Will error without organizationId
const data = useQuery(api.contacts.queries.listContacts, { organizationId });
```

### 4. Return Shape

Always return a consistent object shape:

```typescript
return {
  // Data
  data: transformedData, // The actual data
  items: transformedData, // Alias if helpful

  // Loading states
  isLoading: data === undefined, // True while loading
  isEmpty: data?.length === 0, // True when empty

  // Error handling
  error: data?.error ? new Error(data.error) : null,

  // Mutations (wrapped with toast feedback)
  createItem,
  updateItem,
  deleteItem,

  // Utilities
  refetch: () => Promise.resolve({ data: transformedData }),
};
```

### 5. Toast Integration

Wrap mutations with toast feedback:

```typescript
const deleteContact = useCallback(
  async (contactId: string) => {
    try {
      await deleteContactAction({ contactId, organizationId });
      toast({
        title: "Contact deleted",
        description: "The contact has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete contact",
        variant: "destructive",
      });
      throw error; // Re-throw for caller handling
    }
  },
  [organizationId, toast]
);
```

### 6. Export from Barrel File

Add new hooks to `hooks/index.ts`:

```typescript
// hooks/index.ts
export * from "./business/use-campaigns";
export * from "./business/use-contacts";
export * from "./auth/use-session";
// ... add new hook export
```

## Validation Checklist

Before completing a hook:

- [ ] File named `use-[feature].ts`?
- [ ] Placed in correct domain folder?
- [ ] Uses `useQuery` with conditional skip?
- [ ] Returns `{ data, isLoading, error, ...mutations }`?
- [ ] Mutations wrapped with `useCallback`?
- [ ] Mutations integrated with `useToast`?
- [ ] Exported from `hooks/index.ts`?
- [ ] TypeScript types properly defined?

## Reference Files

- **Example hook**: `apps/dashboard/src/hooks/business/use-campaigns.ts`
- **Toast hook**: `apps/dashboard/src/hooks/core/use-toast.ts`
- **Barrel export**: `apps/dashboard/src/hooks/index.ts`
- **Convex API types**: `packages/convex/_generated/api.d.ts`
