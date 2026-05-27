// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

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
import {
  ActionTimeoutError,
  ContextInsecureError,
  ExtensionUnavailableError,
  DeveloperError,
  NativeFatalError,
  NativeUnavailableError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
  VersionInvalidError,
  VersionMismatchError,
} from "./errors";
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

  const timeout = config.EXTENSION_HANDSHAKE_TIMEOUT + config.NATIVE_APP_HANDSHAKE_TIMEOUT;

  const message: ExtensionStatusRequest = {
    action:         Action.STATUS,
    libraryVersion: config.VERSION,
  };

  try {
    const {
      library,
      extension,
      nativeApp,
    } = await webExtensionService.send<ExtensionStatusResponse>(message, timeout);

    return {
      library,
      extension,
      nativeApp,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      Reflect.set(error, "library", config.VERSION);
    }

    throw error;
  }
}

export async function authenticate(
  challengeNonce: string,
  options?: ActionOptions,
): Promise<LibraryAuthenticateResponse> {
  await extensionLoadDelay();

  if (!challengeNonce) {
    throw new MissingParameterError("authenticate function requires a challengeNonce");
  }

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options?.userInteractionTimeout ?? config.DEFAULT_USER_INTERACTION_TIMEOUT)
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
    (options?.userInteractionTimeout ?? config.DEFAULT_USER_INTERACTION_TIMEOUT) * 2
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
    (options?.userInteractionTimeout ?? config.DEFAULT_USER_INTERACTION_TIMEOUT) * 2
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

export {
  Action,
  ActionOptions,
  ActionTimeoutError,
  ContextInsecureError,
  ErrorCode,
  ExtensionUnavailableError,
  DeveloperError,
  LibraryAuthenticateResponse,
  LibraryGetSigningCertificateResponse,
  LibrarySignResponse,
  LibraryStatusResponse,
  NativeFatalError,
  NativeUnavailableError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
  VersionInvalidError,
  VersionMismatchError,
};
export { config };
