/**
 * Mock Convex client for integration tests.
 *
 * Returns fixture data without calling the real Convex backend.
 * Use vi.mocked() to configure return values per test.
 *
 * @example
 * ```ts
 * import { mockConvexClient } from "@tests/helpers/mock-convex";
 * import { createFullSpec } from "@tests/helpers/fixtures";
 *
 * mockConvexClient.query.mockResolvedValue(createFullSpec());
 * ```
 */
export const mockConvexClient = {
  query: vi.fn(),
  mutation: vi.fn(),
  action: vi.fn(),
};

/**
 * Resets all mock implementations and call history.
 * Call this in beforeEach() to isolate tests.
 */
export function resetMockConvex(): void {
  mockConvexClient.query.mockReset();
  mockConvexClient.mutation.mockReset();
  mockConvexClient.action.mockReset();
}

/**
 * Convenience: configure mockConvexClient.query to return the given value
 * for any call.
 */
export function mockQueryReturn(value: unknown): void {
  mockConvexClient.query.mockResolvedValue(value);
}

/**
 * Convenience: configure mockConvexClient.mutation to return the given value
 * for any call.
 */
export function mockMutationReturn(value: unknown): void {
  mockConvexClient.mutation.mockResolvedValue(value);
}

/**
 * Convenience: configure mockConvexClient.action to return the given value
 * for any call.
 */
export function mockActionReturn(value: unknown): void {
  mockConvexClient.action.mockResolvedValue(value);
}
