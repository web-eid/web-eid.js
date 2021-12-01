/*
 * Copyright (c) Estonian Information System Authority
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { checkCompatibility } from "../version";

describe("version checkCompatibility: library", () => {
  it("should not require update when library version is exactly the same as extension and app version", () => {
    const updateRequired = checkCompatibility({
      library:   "1.2.3",
      extension: "1.2.3",
      nativeApp: "1.2.3",
    });

    expect(updateRequired.extension).toBe(false);
    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should not require update when library version is older than extension or app version", () => {
    const updateRequired = checkCompatibility({
      library:   "1.3.4",
      extension: "2.3.4",
      nativeApp: "2.3.4",
    });

    expect(updateRequired.extension).toBe(false);
    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should ignore minor version", () => {
    const updateRequired = checkCompatibility({
      library:   "2.4.4",
      extension: "2.3.4",
      nativeApp: "2.3.4",
    });

    expect(updateRequired.extension).toBe(false);
    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should ignore patch version", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.5",
      extension: "2.3.4",
      nativeApp: "2.3.4",
    });

    expect(updateRequired.extension).toBe(false);
    expect(updateRequired.nativeApp).toBe(false);
  });
});

describe("version checkCompatibility: extension", () => {
  it("should not require extension update when extension and library versions are exactly the same", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "2.3.4",
      nativeApp: "0.0.0",
    });

    expect(updateRequired.extension).toBe(false);
  });

  it("should not require extension update when extension minor and patch are older, but major is the same", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "2.0.0",
      nativeApp: "0.0.0",
    });

    expect(updateRequired.extension).toBe(false);
  });

  it("should not require extension update when extension version is newer than library version", () => {
    const updateRequired = checkCompatibility({
      library:   "1.2.3",
      extension: "2.3.4",
      nativeApp: "0.0.0",
    });

    expect(updateRequired.extension).toBe(false);
  });

  it("should require extension update when extension major version is older than library version", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "1.3.4",
      nativeApp: "0.0.0",
    });

    expect(updateRequired.extension).toBe(true);
  });
});

describe("version checkCompatibility: app", () => {
  it("should not require app update when app and library versions are exactly the same", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "0.0.0",
      nativeApp: "2.3.4",
    });

    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should not require app update when app minor and patch are older, but major is the same", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "0.0.0",
      nativeApp: "2.0.0",
    });

    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should not require app update when app version is newer than library version", () => {
    const updateRequired = checkCompatibility({
      library:   "1.2.3",
      extension: "0.0.0",
      nativeApp: "2.3.4",
    });

    expect(updateRequired.nativeApp).toBe(false);
  });

  it("should require app update when app major version is older than library version", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "0.0.0",
      nativeApp: "1.3.4",
    });

    expect(updateRequired.extension).toBe(true);
  });
});

describe("version checkCompatibility: extension + app", () => {
  it("should require extension and app updates when their major versions are older than library version", () => {
    const updateRequired = checkCompatibility({
      library:   "2.3.4",
      extension: "1.3.4",
      nativeApp: "1.3.4",
    });

    expect(updateRequired.extension).toBe(true);
    expect(updateRequired.nativeApp).toBe(true);
  });

  it("should require app update when app version is older than extension version", () => {
    const updateRequired = checkCompatibility({
      library:   "1.3.4",
      extension: "2.3.4",
      nativeApp: "1.3.4",
    });

    expect(updateRequired.extension).toBe(false);
    expect(updateRequired.nativeApp).toBe(true);
  });
});
