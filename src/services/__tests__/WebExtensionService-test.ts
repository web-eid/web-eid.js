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

import Action from "../../models/Action";
import WebExtensionService from "../WebExtensionService";

describe("WebExtensionService", () => {
  let service: WebExtensionService;

  beforeAll(() => {
    Object.defineProperty(global.window, "isSecureContext", { get: () => true });
    service = new WebExtensionService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("action web-eid:warning", () => {
    it("should log a warning from web-eid:warning message", async () => {
      jest.spyOn(console, "warn").mockImplementation();
  
      window.postMessage({
        action:   "web-eid:warning",
        warnings: ["example warning"],
      }, "*");
  
      await new Promise((resolve) => setTimeout(resolve));
  
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith("example warning");
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
  
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenCalledWith("example warning 1");
      expect(console.warn).toHaveBeenCalledWith("example warning 2");
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
  
      expect(console.warn).toHaveBeenCalledTimes(3);
      expect(console.warn).toHaveBeenCalledWith("example warning 3");
      expect(console.warn).toHaveBeenCalledWith("example warning 4");
      expect(console.warn).toHaveBeenCalledWith("example warning 5");
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
  
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith("example same warning 1");
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
  
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith("example same warning 2");
    });
  });

  describe("getInitialAction", () => {
    // STATUS
    it("returns Action.STATUS for 'web-eid:status'", () => {
      expect(service.getInitialAction(Action.STATUS)).toBe(Action.STATUS);
    });
  
    it("returns Action.STATUS for 'web-eid:status-ack'", () => {
      expect(service.getInitialAction(Action.STATUS_ACK)).toBe(Action.STATUS);
    });
  
    it("returns Action.STATUS for 'web-eid:status-success'", () => {
      expect(service.getInitialAction(Action.STATUS_SUCCESS)).toBe(Action.STATUS);
    });
  
    it("returns Action.STATUS for 'web-eid:status-failure'", () => {
      expect(service.getInitialAction(Action.STATUS_FAILURE)).toBe(Action.STATUS);
    });
  
    // AUTHENTICATE
    it("returns Action.AUTHENTICATE for 'web-eid:authenticate'", () => {
      expect(service.getInitialAction(Action.AUTHENTICATE)).toBe(Action.AUTHENTICATE);
    });
  
    it("returns Action.AUTHENTICATE for 'web-eid:authenticate-ack'", () => {
      expect(service.getInitialAction(Action.AUTHENTICATE_ACK)).toBe(Action.AUTHENTICATE);
    });
  
    it("returns Action.AUTHENTICATE for 'web-eid:authenticate-success'", () => {
      expect(service.getInitialAction(Action.AUTHENTICATE_SUCCESS)).toBe(Action.AUTHENTICATE);
    });
  
    it("returns Action.AUTHENTICATE for 'web-eid:authenticate-failure'", () => {
      expect(service.getInitialAction(Action.AUTHENTICATE_FAILURE)).toBe(Action.AUTHENTICATE);
    });
  
    // GET_SIGNING_CERTIFICATE
    it("returns Action.GET_SIGNING_CERTIFICATE for 'web-eid:get-signing-certificate'", () => {
      expect(service.getInitialAction(Action.GET_SIGNING_CERTIFICATE)).toBe(Action.GET_SIGNING_CERTIFICATE);
    });
  
    it("returns Action.GET_SIGNING_CERTIFICATE for 'web-eid:get-signing-certificate-ack'", () => {
      expect(service.getInitialAction(Action.GET_SIGNING_CERTIFICATE_ACK)).toBe(Action.GET_SIGNING_CERTIFICATE);
    });
  
    it("returns Action.GET_SIGNING_CERTIFICATE for 'web-eid:get-signing-certificate-success'", () => {
      expect(service.getInitialAction(Action.GET_SIGNING_CERTIFICATE_SUCCESS)).toBe(Action.GET_SIGNING_CERTIFICATE);
    });
  
    it("returns Action.GET_SIGNING_CERTIFICATE for 'web-eid:get-signing-certificate-failure'", () => {
      expect(service.getInitialAction(Action.GET_SIGNING_CERTIFICATE_FAILURE)).toBe(Action.GET_SIGNING_CERTIFICATE);
    });
  
    // SIGN
    it("returns Action.SIGN for 'web-eid:sign'", () => {
      expect(service.getInitialAction(Action.SIGN)).toBe(Action.SIGN);
    });
  
    it("returns Action.SIGN for 'web-eid:sign-ack'", () => {
      expect(service.getInitialAction(Action.SIGN_ACK)).toBe(Action.SIGN);
    });
  
    it("returns Action.SIGN for 'web-eid:sign-success'", () => {
      expect(service.getInitialAction(Action.SIGN_SUCCESS)).toBe(Action.SIGN);
    });
  
    it("returns Action.SIGN for 'web-eid:sign-failure'", () => {
      expect(service.getInitialAction(Action.SIGN_FAILURE)).toBe(Action.SIGN);
    });
  });
});
