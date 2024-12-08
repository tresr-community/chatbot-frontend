import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import jsonc from "eslint-plugin-jsonc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";
import path from "path";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "**/*.astro", // TODO: Fix broken parser for Astro files.
      "**/.astro/**",
      "**/.cache/**",
      "**/.env*",
      "**/.prettier*",
      "**/.wrangler/**",
      "**/astro.config.{js,mjs,cjs}",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/postcss.config.{js,mjs,cjs}",
      "**/tailwind.config.{js,mjs,cjs}",
      ".devcontainer.json",
      ".devenv/**",
      ".direnv/**",
      ".vscode/**",
      "devenv.json",
      "package.json",
      "public/manifest.json",
      "tsconfig.json",
    ],
  },

  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "prettier/prettier": "error",
    },
  },

  // JavaScript files
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      "@eslint/js": js,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parser: js.parser,
      parserOptions: {
        sourceType: "script",
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Astro files
  {
    files: ["**/*.astro"],
    plugins: {
      astro: astro,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        "astro/astro": true,
      },
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "astro/no-conflict-set-directives": "error",
      "astro/no-unused-define-vars-in-style": "error",
      "astro/no-unused-css-selector": "error",
      "astro/prefer-class-list-directive": "error",
    },
  },

  // JSON files
  {
    files: ["**/*.{json,jsonc}"],
    plugins: {
      jsonc: jsonc,
    },
    languageOptions: {
      parser: jsonc.parser,
    },
    rules: {
      ...jsonc.configs["recommended-with-json"].rules,
    },
  },

  // Wrangler and build files
  {
    files: ["**/.wrangler/**/*.js", "**/build/**/*.{js,mjs}"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "no-undef": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Global settings
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        Request: "readonly",
        Response: "readonly",
        URL: "readonly",
        Headers: "readonly",
        console: "readonly",
        WebAssembly: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        queueMicrotask: "readonly",
        module: "readonly",
        global: "readonly",
        self: "readonly",
        window: "readonly",
        htmx: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
    },
  }
);
