import { terser } from "rollup-plugin-terser";

export default {
  input: "./dist/node/web-eid.js",

  output: [
    {
      file:      "dist/iife/web-eid.js",
      format:    "iife",
      name:      "webeid",
      sourcemap: true,
    },
    {
      file:      "dist/iife/web-eid.min.js",
      format:    "iife",
      name:      "webeid",
      sourcemap: false,
      plugins:   [terser()],
    },
    {
      file:      "dist/umd/web-eid.js",
      format:    "umd",
      name:      "webeid",
      sourcemap: true,
    },
    {
      file:      "dist/umd/web-eid.min.js",
      format:    "umd",
      name:      "webeid",
      sourcemap: false,
      plugins:   [terser()],
    },
    {
      file:   "dist/es/web-eid.js",
      format: "es",
    },
  ],
};
