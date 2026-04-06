import eslint from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

const sharedOptions = {
  js: {
    files: ["**/*.{js,mjs}"],

    languageOptions: {
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.webextensions,
      },
    },
  },

  ts: {
    files: ["**/*.ts"],

    languageOptions: {
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.webextensions,
      },

      parser: tseslint.parser,

      parserOptions: {
        project:         "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
};

const overrides = {
  js: {
    ...sharedOptions.js,

    name: "web-eid/js/override",

    plugins: { "@stylistic/js": stylistic },

    rules: {
      "sort-imports": ["error", { allowSeparatedGroups: true }],

      "@stylistic/js/quotes":                ["error", "double"],
      "@stylistic/js/key-spacing":           ["error", { "align": "value" }],
      "@stylistic/js/comma-dangle":          ["error", "always-multiline"],
      "@stylistic/js/object-curly-spacing":  ["error", "always"],
      "@stylistic/js/array-bracket-spacing": "error",
      "@stylistic/js/indent":                ["error", 2, { "SwitchCase": 1 }],
      "@stylistic/js/semi":                  "error",
      "@stylistic/js/eol-last":              ["warn", "always"],
      "@stylistic/js/linebreak-style":       ["error", "unix"],
      "@stylistic/js/max-len":               ["error", { code: 160 }],
    },
  },

  ts: {
    ...sharedOptions.ts,

    name: "web-eid/ts/override",

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@stylistic/ts":      stylistic,
    },

    rules: {
      "@typescript-eslint/array-type":      ["error", { default: "generic" }],
      "@stylistic/ts/semi":                 "error",
      "@stylistic/ts/quotes":               ["error", "double"],
      "@stylistic/ts/comma-dangle":         ["error", "always-multiline"],
      "@stylistic/ts/object-curly-spacing": ["error", "always"],
      "@stylistic/ts/indent":               ["error", 2, { "SwitchCase": 1 }],
      "@stylistic/ts/eol-last":             ["error", "always"],
      "@stylistic/ts/linebreak-style":      ["error", "unix"],
      "@stylistic/ts/max-len":              ["error", { code: 160 }],
    },
  },
};

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "examples/",
      "web-eid.*",
      "config.*",
      "errors/",
      "models/",
      "services/",
      "utils/",
    ],
  },

  {
    name: "eslint/recommended",

    ...eslint.configs.recommended,
    ...sharedOptions.js,
  },

  ...tseslint.configs.recommendedTypeChecked.map((recommended) => ({
    ...recommended,
    ...sharedOptions.ts,
  })),

  ...tseslint.configs.stylisticTypeChecked.map((stylistic) => ({
    ...stylistic,
    ...sharedOptions.ts,
  })),

  overrides.js,
  overrides.ts,
];
