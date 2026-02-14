import path from "path";

import cleanup from "rollup-plugin-cleanup";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import license from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";

const cleanupOpts = { comments: ["jsdoc"] };
const licenseOpts = {
  banner: {
    content: {
      file:     path.join(import.meta.dirname, "LICENSE"),
      encoding: "utf-8",
    },
  },
};

const outputModules = (format) => ({
  dir:             `dist/${format}`,
  format:          format,
  exports:         "named",
  preserveModules: true,
  sourcemap:       true,
});
const outputBundle = (format, ext) => ({
  file:      `dist/${format}/web-eid.${ext}`,
  name:      "webeid",
  format:    format,
  exports:   "named",
  sourcemap: true,
});
const outputMinifiedBundle = (format, ext) => ({
  file:      `dist/${format}/web-eid.min.${ext}`,
  name:      "webeid",
  format:    format,
  exports:   "named",
  plugins:   [terser()],
  sourcemap: true,
});
export default [
  defineConfig({
    input:   "src/index.ts",
    plugins: [
      esbuild({
        target: "es2021",
      }),
      cleanup(cleanupOpts),
      license(licenseOpts),
    ],
    output: [
      outputModules("es"),
      outputBundle("umd", "js"),
      outputMinifiedBundle("umd", "js"),
      outputBundle("iife", "js"),
      outputMinifiedBundle("iife", "js"),
    ],
  }),
  defineConfig({
    input:   "src/index.ts",
    plugins: [
      dts(),
      cleanup(cleanupOpts),
      license(licenseOpts),
    ],
    output: [outputModules("es")],
  }),
];
