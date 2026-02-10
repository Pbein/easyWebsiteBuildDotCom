import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/unit/**/*.test.ts",
      "tests/unit/**/*.test.tsx",
      "tests/integration/**/*.test.ts",
      "tests/integration/**/*.test.tsx",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/lib/**", "src/components/library/**"],
      exclude: ["src/components/platform/**", "node_modules", "tests"],
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
