import "@testing-library/jest-dom";
import React from "react";

// Mock localStorage for Zustand persist
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => {
  function createMotionComponent(tag: string) {
    const MotionComponent = (props: Record<string, unknown>) => {
      const { children, ...rest } = props || {};
      const filteredProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (
          !key.startsWith("animate") &&
          !key.startsWith("initial") &&
          !key.startsWith("exit") &&
          !key.startsWith("transition") &&
          !key.startsWith("variants") &&
          !key.startsWith("whileHover") &&
          !key.startsWith("whileTap") &&
          !key.startsWith("whileInView") &&
          key !== "layout" &&
          key !== "layoutId"
        ) {
          filteredProps[key] = value;
        }
      }
      return React.createElement(tag, filteredProps, children as React.ReactNode);
    };
    MotionComponent.displayName = `Motion${tag}`;
    return MotionComponent;
  }

  return {
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (typeof prop === "string") {
            return createMotionComponent(prop);
          }
          return undefined;
        },
      }
    ),
    AnimatePresence: ({ children }: { children: unknown }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
    useMotionValue: (initial: number) => ({ get: () => initial, set: vi.fn() }),
    useTransform: () => ({ get: () => 0, set: vi.fn() }),
    useSpring: () => ({ get: () => 0, set: vi.fn() }),
  };
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
