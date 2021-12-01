import path from "path";

import cleanup from "rollup-plugin-cleanup";
import license from "rollup-plugin-license";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./dist/node/web-eid.js",

  plugins: [
    cleanup({ comments: ["jsdoc"] }),
    license({
      banner: {
        content: {
          // eslint-disable-next-line no-undef
          file:     path.join(__dirname, "LICENSE"),
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
