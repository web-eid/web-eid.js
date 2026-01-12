import path from "path";

import cleanup from "rollup-plugin-cleanup";
import license from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";

export default {
  input: "./dist/node/web-eid.js",

  plugins: [
    cleanup({ comments: ["jsdoc"] }),
    license({
      banner: {
        content: {
          file:     path.join(import.meta.dirname, "LICENSE"),
          encoding: "utf-8",
        },
      },
    }),
  ],

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
      file:      "dist/umd/web-eid.cjs",
      format:    "umd",
      name:      "webeid",
      sourcemap: true,
    },
    {
      file:      "dist/umd/web-eid.min.cjs",
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
