/*
 * Copyright (c) 2020-2025 Estonian Information System Authority
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

import * as webeid from "../web-eid";
import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";
import NativeAppOptions from "../models/ActionOptions";

Object.defineProperty(global.window, "isSecureContext", { get: () => true });

describe("status", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    await expect(webeid.status()).rejects.toThrow(ExtensionUnavailableError);
  });


  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    try { await webeid.status(); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action:         "web-eid:status",
        libraryVersion: process.env.npm_package_version,
      },
      "*",
    );
  });

  it("should return library, extension and app versions", async () => {
    const statusPromise = webeid.status();

    window.postMessage({
      action: "web-eid:status-ack",
    }, "*");

    window.postMessage({
      action:    "web-eid:status-success",
      library:   process.env.npm_package_version,
      extension: process.env.npm_package_version,
      nativeApp: process.env.npm_package_version,
    }, "*");

    expect(await statusPromise).toMatchObject({
      library:   process.env.npm_package_version,
      extension: process.env.npm_package_version,
      nativeApp: process.env.npm_package_version,
    });
  });
});

describe("authenticate", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    const challengeNonce = "12345678901234567890123456789012345678901234";

    await expect(webeid.authenticate(challengeNonce, options)).rejects.toThrow(ExtensionUnavailableError);
  });

  it("should include challengeNonce and libraryVersion with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const options: NativeAppOptions = { userInteractionTimeout: 1 };

    const challengeNonce = "12345678901234567890123456789012345678901234";

    try { await webeid.authenticate(challengeNonce, options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:authenticate",

        challengeNonce: "12345678901234567890123456789012345678901234",
        libraryVersion: process.env.npm_package_version,

        options: { userInteractionTimeout: 1 },
      },
      "*",
    );
  });

  it("should optionally include lang option with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    // Including userInteractionTimeout to speed up the test
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    const challengeNonce = "12345678901234567890123456789012345678901234";

    try { await webeid.authenticate(challengeNonce, options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:authenticate",

        challengeNonce: "12345678901234567890123456789012345678901234",
        libraryVersion: process.env.npm_package_version,

        options: { userInteractionTimeout: 1, lang: "en" },
      },
      "*",
    );
  });
});

describe("getSigningCertificate", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    await expect(webeid.getSigningCertificate(options)).rejects.toThrow(ExtensionUnavailableError);
  });

  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const options: NativeAppOptions = { userInteractionTimeout: 1 };

    try { await webeid.getSigningCertificate(options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:get-signing-certificate",

        libraryVersion: process.env.npm_package_version,

        options: {
          userInteractionTimeout: 1,
        },
      },
      "*",
    );
  });


  it("should optionally include lang option with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    // Including userInteractionTimeout to speed up the test
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    try { await webeid.getSigningCertificate(options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:get-signing-certificate",

        libraryVersion: process.env.npm_package_version,

        options: { userInteractionTimeout: 1, lang: "en" },
      },
      "*",
    );
  });
});

describe("sign", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    const certificate  = "MIID7DCCA02gAwIBAgIQGWaqJX+JmHFbyFd4ba1pajAKBggqhkjOPQQDBDBgM...";
    const hash = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4";
    const hashFunction = "SHA-384";

    await expect(webeid.sign(certificate, hash, hashFunction, options)).rejects.toThrow(ExtensionUnavailableError);
  });

  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const certificate  = "MIID7DCCA02gAwIBAgIQGWaqJX+JmHFbyFd4ba1pajAKBggqhkjOPQQDBDBgM...";
    const hash         = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4";
    const hashFunction = "SHA-384";

    const options: NativeAppOptions = { userInteractionTimeout: 1 };

    try { await webeid.sign(certificate, hash, hashFunction, options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:sign",

        certificate:    "MIID7DCCA02gAwIBAgIQGWaqJX+JmHFbyFd4ba1pajAKBggqhkjOPQQDBDBgM...",
        hash:           "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4",
        hashFunction:   "SHA-384",
        libraryVersion: process.env.npm_package_version,

        options: {
          userInteractionTimeout: 1,
        },
      },
      "*",
    );
  });


  it("should optionally include lang option with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const certificate  = "MIID7DCCA02gAwIBAgIQGWaqJX+JmHFbyFd4ba1pajAKBggqhkjOPQQDBDBgM...";
    const hash         = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4";
    const hashFunction = "SHA-384";

    // Including userInteractionTimeout to speed up the test
    const options: NativeAppOptions = { userInteractionTimeout: 1, lang: "en" };

    try { await webeid.sign(certificate, hash, hashFunction, options); } catch { /* ignore */ }

    expect(window.postMessage).toHaveBeenCalledTimes(1);
    expect(window.postMessage).toHaveBeenCalledWith(
      {
        action: "web-eid:sign",

        certificate:    "MIID7DCCA02gAwIBAgIQGWaqJX+JmHFbyFd4ba1pajAKBggqhkjOPQQDBDBgM...",
        hash:           "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4",
        hashFunction:   "SHA-384",
        libraryVersion: process.env.npm_package_version,

        options: { userInteractionTimeout: 1, lang: "en" },
      },
      "*",
    );
  });
});
