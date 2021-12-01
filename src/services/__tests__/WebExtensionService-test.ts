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

import WebExtensionService from "../WebExtensionService";

describe("status", () => {
  beforeAll(() => {
    Object.defineProperty(global.window, "isSecureContext", { get: () => true });
    new WebExtensionService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log a warning from web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example warning");
  });

  it("should log multiple different warnings from separate web-eid:warning messages", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning 1"],
    }, "*");

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning 2"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(2);
    expect(console.warn).toBeCalledWith("example warning 1");
    expect(console.warn).toBeCalledWith("example warning 2");
  });

  it("should log multiple different warnings from a single web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: [
        "example warning 3",
        "example warning 4",
        "example warning 5",
      ],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(3);
    expect(console.warn).toBeCalledWith("example warning 3");
    expect(console.warn).toBeCalledWith("example warning 4");
    expect(console.warn).toBeCalledWith("example warning 5");
  });

  it("should not log the same message multiple times from one web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: [
        "example same warning 1",
        "example same warning 1",
      ],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example same warning 1");
  });

  it("should not log the same message multiple times from multiple web-eid:warning messages", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example same warning 2"],
    }, "*");

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example same warning 2"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example same warning 2");
  });
});
