// @ts-check
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],

    files: ["src/**/*.ts"],

    ignores: [
      "dist/",
      "**/__tests__/**/*"
    ],

    plugins: {
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      sourceType: "module",
      globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2021,
          ...globals.webextensions,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "quotes":                "error",
      "key-spacing":           ["error", { "align": "value" }],
      "comma-dangle":          ["error", "only-multiline"],
      "object-curly-spacing":  ["error", "always"],
      "array-bracket-spacing": "error",
      "indent":                ["error", 2, { "SwitchCase": 1 }],
      "sort-imports":          ["error", { allowSeparatedGroups: true }],

      "@stylistic/ts/semi": "error",

      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
  },
);
