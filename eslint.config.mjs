import eslint from "@eslint/js";
import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
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

    plugins: { "@stylistic/js": stylisticJs },
  
    rules: {
      "sort-imports": ["error", { allowSeparatedGroups: true }],
  
      "@stylistic/js/quotes":                "error",
      "@stylistic/js/key-spacing":           ["error", { "align": "value" }],
      "@stylistic/js/comma-dangle":          ["error", "always-multiline"],
      "@stylistic/js/object-curly-spacing":  ["error", "always"],
      "@stylistic/js/array-bracket-spacing": "error",
      "@stylistic/js/indent":                ["error", 2, { "SwitchCase": 1 }],
      "@stylistic/js/semi":                  "error",
    },
  },

  ts: {
    ...sharedOptions.ts,

    name: "web-eid/ts/override",

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@stylistic/ts":      stylisticTs,
    },
  
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@stylistic/ts/semi":            "error",
    },
  },
};

export default [
  { ignores: ["dist/", "node_modules/"] },
  
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
