/**
 * In-memory mock of Convex's ctx.db for testing handler logic.
 *
 * Simulates insert, query (with index + ordering), patch, delete, get.
 * Each table is stored as a Map<string, MockDocument>.
 * IDs are generated as `${tableName}:${counter}`.
 *
 * Usage:
 *   const ctx = createMockCtx();
 *   await siteSpecHandler(ctx, { sessionId: "abc", ... });
 *   const result = await ctx.db.get("siteSpecs:0");
 */

interface MockDocument {
  _id: string;
  _creationTime: number;
  [key: string]: unknown;
}

interface MockQueryBuilder {
  withIndex: (
    indexName: string,
    predicate: (q: IndexQueryBuilder) => IndexQueryBuilder
  ) => MockQueryBuilder;
  order: (direction: "asc" | "desc") => MockQueryBuilder;
  first: () => Promise<MockDocument | null>;
  take: (n: number) => Promise<MockDocument[]>;
  collect: () => Promise<MockDocument[]>;
}

interface IndexQueryBuilder {
  eq: (field: string, value: unknown) => IndexQueryBuilder;
}

interface MockDb {
  insert: (tableName: string, doc: Record<string, unknown>) => Promise<string>;
  get: (id: string) => Promise<MockDocument | null>;
  patch: (id: string, partial: Record<string, unknown>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  query: (tableName: string) => MockQueryBuilder;
  /** Test-only: inspect raw table data */
  _tables: Map<string, Map<string, MockDocument>>;
}

export function createMockDb(): MockDb {
  const tables = new Map<string, Map<string, MockDocument>>();
  let idCounter = 0;
  // Monotonic counter ensures each document gets a unique, strictly
  // increasing _creationTime — even when Date.now() returns the same
  // millisecond across rapid sequential inserts. This mirrors Convex's
  // real behavior where each document is guaranteed a unique order.
  let creationCounter = 0;

  function getTable(tableName: string): Map<string, MockDocument> {
    let table = tables.get(tableName);
    if (!table) {
      table = new Map();
      tables.set(tableName, table);
    }
    return table;
  }

  const db: MockDb = {
    _tables: tables,

    async insert(tableName: string, doc: Record<string, unknown>): Promise<string> {
      const table = getTable(tableName);
      const id = `${tableName}:${idCounter++}`;
      // Use Date.now() as the base but add the monotonic counter
      // to guarantee strict ordering across inserts.
      const creationTime = Date.now() + creationCounter++;
      const fullDoc: MockDocument = {
        ...doc,
        _id: id,
        _creationTime: creationTime,
      };
      table.set(id, fullDoc);
      return id;
    },

    async get(id: string): Promise<MockDocument | null> {
      // The table name is the prefix before the first ':'
      const tableName = id.split(":")[0];
      const table = tables.get(tableName);
      if (!table) return null;
      return table.get(id) ?? null;
    },

    async patch(id: string, partial: Record<string, unknown>): Promise<void> {
      const tableName = id.split(":")[0];
      const table = tables.get(tableName);
      if (!table) return;
      const existing = table.get(id);
      if (!existing) return;
      const patched: MockDocument = { ...existing, ...partial, _id: id };
      table.set(id, patched);
    },

    async delete(id: string): Promise<void> {
      const tableName = id.split(":")[0];
      const table = tables.get(tableName);
      if (!table) return;
      table.delete(id);
    },

    query(tableName: string): MockQueryBuilder {
      const table = getTable(tableName);

      // Internal state for the builder chain
      let filterField: string | null = null;
      let filterValue: unknown = null;
      let orderDirection: "asc" | "desc" = "asc";

      function getFilteredDocs(): MockDocument[] {
        let docs = Array.from(table.values());

        // Apply index filter if set
        if (filterField !== null) {
          docs = docs.filter((d) => d[filterField!] === filterValue);
        }

        // Sort by _creationTime
        docs.sort((a, b) => {
          if (orderDirection === "asc") {
            return a._creationTime - b._creationTime;
          }
          return b._creationTime - a._creationTime;
        });

        return docs;
      }

      const builder: MockQueryBuilder = {
        withIndex(
          _indexName: string,
          predicate: (q: IndexQueryBuilder) => IndexQueryBuilder
        ): MockQueryBuilder {
          // Capture the eq() call from the predicate
          const indexBuilder: IndexQueryBuilder = {
            eq(field: string, value: unknown): IndexQueryBuilder {
              filterField = field;
              filterValue = value;
              return indexBuilder;
            },
          };
          predicate(indexBuilder);
          return builder;
        },

        order(direction: "asc" | "desc"): MockQueryBuilder {
          orderDirection = direction;
          return builder;
        },

        async first(): Promise<MockDocument | null> {
          const docs = getFilteredDocs();
          return docs[0] ?? null;
        },

        async take(n: number): Promise<MockDocument[]> {
          const docs = getFilteredDocs();
          return docs.slice(0, n);
        },

        async collect(): Promise<MockDocument[]> {
          return getFilteredDocs();
        },
      };

      return builder;
    },
  };

  return db;
}

export interface MockCtx {
  db: MockDb;
}

export function createMockCtx(db?: MockDb): MockCtx {
  return { db: db ?? createMockDb() };
}
