/* eslint-disable no-undef */
module.exports = {
  root:    true,
  parser:  "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "quotes":                             "error",
    "semi":                               "off",
    "key-spacing":                        ["error", { "align": "value" }],
    "comma-dangle":                       ["error", "always-multiline"],
    "object-curly-spacing":               ["error", "always"],
    "array-bracket-spacing":              "error",
    "indent":                             "off",
    "@typescript-eslint/indent":          ["error", 2],
    "@typescript-eslint/semi":            ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "sort-imports":                       ["error", { allowSeparatedGroups: true }],
  },
};
