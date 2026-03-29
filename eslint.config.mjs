import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ESLint config for simple import sort
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "tanstack-query": tanstackQuery,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Disable exhaustive-deps to allow selective hook dependencies
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // ESLint config for prettier
  prettier,
  
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
