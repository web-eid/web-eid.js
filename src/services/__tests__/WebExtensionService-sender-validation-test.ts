// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import {
  ExtensionAuthenticateRequest,
  ExtensionSignRequest,
} from "../../models/message/ExtensionRequest";
import {
  ExtensionAuthenticateResponse,
  ExtensionSignResponse,
} from "../../models/message/ExtensionResponse";

import Action from "../../models/Action";
import ActionTimeoutError from "../../errors/ActionTimeoutError";
import WebExtensionService from "../WebExtensionService";

/**
 * Regression tests for sender validation in receive().
 *
 * A message is only honoured when it originates from the page's own window
 * (event.source === window) and origin (event.origin === window.location.origin),
 * matching how the extension content script posts responses back into the page.
 * Forged responses from embedded iframes, framing parents or other windows must
 * be ignored. See CWE-346 / CWE-940.
 */
describe("WebExtensionService sender validation", () => {
  beforeAll(() => {
    Object.defineProperty(global.window, "isSecureContext", { get: () => true });
  });

  function dispatch(data: unknown, init: { source?: unknown; origin?: string }): void {
    window.dispatchEvent(new MessageEvent("message", {
      data,
      source: init.source as MessageEventSource | null,
      origin: init.origin ?? window.location.origin,
    }));
  }

  const authenticateRequest: ExtensionAuthenticateRequest = {
    action:         Action.AUTHENTICATE,
    libraryVersion: "2.1.0",
    challengeNonce: "12345678901234567890123456789012345678901234",
  };

  const signRequest: ExtensionSignRequest = {
    action:         Action.SIGN,
    libraryVersion: "2.1.0",
    certificate:    "cert",
    hash:           "hash",
    hashFunction:   "SHA-256",
  };

  it("ignores a success response from a foreign source (e.g. an iframe)", async () => {
    const service = new WebExtensionService();
    const pending = service.send<ExtensionAuthenticateResponse>(authenticateRequest, 50);

    dispatch({
      action:                "web-eid:authenticate-success",
      unverifiedCertificate: "ATTACKER_CONTROLLED_CERT",
      signature:             "ATTACKER_CONTROLLED_SIGNATURE",
    }, { source: {}, origin: window.location.origin });

    // The forged response is dropped, so the request times out instead of
    // resolving with attacker data.
    await expect(pending).rejects.toBeInstanceOf(ActionTimeoutError);
  });

  it("ignores a success response from a foreign origin", async () => {
    const service = new WebExtensionService();
    const pending = service.send<ExtensionSignResponse>(signRequest, 50);

    dispatch({
      action:    "web-eid:sign-success",
      signature: "ATTACKER_CONTROLLED_SIGNATURE",
    }, { source: window, origin: "https://evil.example" });

    await expect(pending).rejects.toBeInstanceOf(ActionTimeoutError);
  });

  it("ignores a forged failure response from a foreign frame", async () => {
    const service = new WebExtensionService();
    const pending = service.send<ExtensionSignResponse>(signRequest, 50);

    dispatch({
      action: "web-eid:sign-failure",
      error:  { code: "ERR_WEBEID_USER_CANCELLED", message: "spoofed" },
    }, { source: {}, origin: "https://evil.example" });

    // Not rejected by the spoofed failure; times out instead.
    await expect(pending).rejects.toBeInstanceOf(ActionTimeoutError);
  });

  it("accepts a legitimate same-window response", async () => {
    const service = new WebExtensionService();
    const pending = service.send<ExtensionAuthenticateResponse>(authenticateRequest, 5000);

    dispatch({
      action:                "web-eid:authenticate-success",
      unverifiedCertificate: "REAL_CERT",
      signature:             "REAL_SIGNATURE",
    }, { source: window, origin: window.location.origin });

    const result = await pending;
    expect(result.unverifiedCertificate).toBe("REAL_CERT");
  });
});
