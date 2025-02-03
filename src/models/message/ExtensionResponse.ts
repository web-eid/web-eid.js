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

import { SerializedError } from "../../errors/SerializedError";
import { SignatureAlgorithm } from "../SignatureAlgorithm";

import Action from "../Action";

export interface ExtensionWarningResponse {
  action: Action.WARNING;

  /**
   * Warning messages from the extension
   *
   * The extension will only trigger warnings when needed.
   * These warnings could be deprecation warnings of the current API
   * and are meant for the maintainers of the website which uses the Web-eID library.
   */
  warnings: Array<string>;
}

export interface ExtensionStatusResponse {
  action: Action.STATUS_SUCCESS;

  /**
   * A version number string in SemVer format
   *
   * @see https://semver.org/
   */
  library: string;

  /**
   * A version number string in SemVer format
   *
   * @see https://semver.org/
   */
  extension: string;

  /**
   * A version number string in SemVer format
   *
   * @see https://semver.org/
   */
  nativeApp: string;
}

export interface ExtensionAuthenticateResponse {
  action: Action.AUTHENTICATE_SUCCESS;

  /**
   * The base64-encoded DER-encoded authentication certificate of the eID user
   *
   * The public key contained in this certificate should be used to verify the signature.
   * The certificate cannot be trusted as it is received from client side and the client can submit a malicious certificate.
   * To establish trust, it must be verified that the certificate is signed by a trusted certificate authority.
   */
  unverifiedCertificate: string;

  /**
   * The algorithm used to produce the authentication signature
   *
   * The allowed values are the algorithms specified in JWA RFC8 sections 3.3, 3.4 and 3.5
   * @see https://www.ietf.org/rfc/rfc7518.html
   */
  algorithm:
  | "ES256" | "ES384" | "ES512"  // ECDSA
  | "PS256" | "PS384" | "PS512"  // RSASSA-PSS
  | "RS256" | "RS384" | "RS512"; // RSASSA-PKCS1-v1_5,

  /**
   * The base64-encoded signature of the token
   */
  signature: string;

  /**
   * The type identifier and version of the token format separated by a colon character
   *
   * @example "web-eid:1.0"
   */
  format: string;

  /**
   * The URL identifying the name and version of the application that issued the token
   *
   * @example "https://web-eid.eu/web-eid-app/releases/2.0.0+0"
   */
  appVersion: string;
}

export interface ExtensionGetSigningCertificateResponse {
  action: Action.GET_SIGNING_CERTIFICATE_SUCCESS;

  /**
   * The Base64-encoded DER-encoded signing certificate of the eID user
   */
  certificate: string;

  /**
   * The supported signature algorithm options
   */
  supportedSignatureAlgorithms: Array<SignatureAlgorithm>;
}

export interface ExtensionSignResponse {
  action: Action.SIGN_SUCCESS;

  /**
   * Signature algorithm
   */
  signatureAlgorithm: SignatureAlgorithm;

  /**
   * The base64-encoded signature
   */
  signature: string;
}

export interface ExtensionFailureResponse {
  action:
  | Action.STATUS_FAILURE
  | Action.AUTHENTICATE_FAILURE
  | Action.GET_SIGNING_CERTIFICATE_FAILURE
  | Action.SIGN_FAILURE;

  error: SerializedError;
}

export type ExtensionResponse
  = ExtensionStatusResponse
  | ExtensionAuthenticateResponse
  | ExtensionGetSigningCertificateResponse
  | ExtensionSignResponse
  | ExtensionWarningResponse
  | ExtensionFailureResponse;
