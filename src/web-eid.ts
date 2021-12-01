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

import * as version from "./utils/version";

import {
  ExtensionAuthenticateRequest,
  ExtensionGetSigningCertificateRequest,
  ExtensionSignRequest,
  ExtensionStatusRequest,
} from "./models/message/ExtensionRequest";
import {
  ExtensionAuthenticateResponse,
  ExtensionGetSigningCertificateResponse,
  ExtensionSignResponse,
  ExtensionStatusResponse,
} from "./models/message/ExtensionResponse";
import {
  LibraryAuthenticateResponse,
  LibraryGetSigningCertificateResponse,
  LibrarySignResponse,
  LibraryStatusResponse,
} from "./models/message/LibraryResponse";

import Action from "./models/Action";
import ActionOptions from "./models/ActionOptions";
import ErrorCode from "./errors/ErrorCode";
import MissingParameterError from "./errors/MissingParameterError";
import VersionMismatchError from "./errors/VersionMismatchError";
import WebExtensionService from "./services/WebExtensionService";
import config from "./config";
import sleep from "./utils/sleep";



const webExtensionService = new WebExtensionService();
const initializationTime  = +new Date();

/**
 * Give browsers a moment to load the content script
 */
async function extensionLoadDelay(): Promise<void> {
  const now = +new Date();
  await sleep(initializationTime + config.MAX_EXTENSION_LOAD_DELAY - now);
}

export async function status(): Promise<LibraryStatusResponse> {
  await extensionLoadDelay();

  let statusResponse: ExtensionStatusResponse;

  const library = config.VERSION;
  const timeout = config.EXTENSION_HANDSHAKE_TIMEOUT + config.NATIVE_APP_HANDSHAKE_TIMEOUT;

  const message: ExtensionStatusRequest = {
    action:         Action.STATUS,
    libraryVersion: config.VERSION,
  };

  try {
    statusResponse = await webExtensionService.send(message, timeout);
  } catch (error: any) {
    error.library = library;

    throw error;
  }

  const status: LibraryStatusResponse = {
    library,
    ...statusResponse,
  };

  const requiresUpdate = version.checkCompatibility(status);

  if (requiresUpdate.extension || requiresUpdate.nativeApp) {
    throw new VersionMismatchError(undefined, status, requiresUpdate);
  }

  return status;
}

export async function authenticate(
  challengeNonce: string,
  options?: ActionOptions
): Promise<LibraryAuthenticateResponse> {
  await extensionLoadDelay();

  if (!challengeNonce) {
    throw new MissingParameterError("authenticate function requires a challengeNonce");
  }

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options?.userInteractionTimeout || config.DEFAULT_USER_INTERACTION_TIMEOUT)
  );

  const message: ExtensionAuthenticateRequest = {
    action:         Action.AUTHENTICATE,
    libraryVersion: config.VERSION,

    challengeNonce,
    options,
  };

  const {
    unverifiedCertificate,
    algorithm,
    signature,
    format,
    appVersion,
  } = await webExtensionService.send<ExtensionAuthenticateResponse>(message, timeout);

  return {
    unverifiedCertificate,
    algorithm,
    signature,
    format,
    appVersion,
  };
}

export async function getSigningCertificate(options?: ActionOptions): Promise<LibraryGetSigningCertificateResponse> {
  await extensionLoadDelay();

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options?.userInteractionTimeout || config.DEFAULT_USER_INTERACTION_TIMEOUT) * 2
  );

  const message: ExtensionGetSigningCertificateRequest = {
    action:         Action.GET_SIGNING_CERTIFICATE,
    libraryVersion: config.VERSION,

    options,
  };

  const {
    certificate,
    supportedSignatureAlgorithms,
  } = await webExtensionService.send<ExtensionGetSigningCertificateResponse>(message, timeout);

  return {
    certificate,
    supportedSignatureAlgorithms,
  };
}

export async function sign(
  certificate: string,
  hash: string,
  hashFunction: string,
  options?: ActionOptions,
): Promise<LibrarySignResponse> {
  await extensionLoadDelay();

  if (!certificate) {
    throw new MissingParameterError("sign function requires a certificate as parameter");
  }

  if (!hash) {
    throw new MissingParameterError("sign function requires a hash as parameter");
  }

  if (!hashFunction) {
    throw new MissingParameterError("sign function requires a hashFunction as parameter");
  }

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options?.userInteractionTimeout || config.DEFAULT_USER_INTERACTION_TIMEOUT) * 2
  );

  const message: ExtensionSignRequest = {
    action:         Action.SIGN,
    libraryVersion: config.VERSION,

    certificate,
    hash,
    hashFunction,
    options,
  };

  const {
    signature,
    signatureAlgorithm,
  } = await webExtensionService.send<ExtensionSignResponse>(message, timeout);

  return {
    signature,
    signatureAlgorithm,
  };
}

export { Action, ErrorCode };
export { hasVersionProperties } from "./utils/version";
export { config };
