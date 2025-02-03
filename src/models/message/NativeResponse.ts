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

import { SignatureAlgorithm } from "../SignatureAlgorithm";

export interface NativeStatusResponse {
  version: string;
}

export interface NativeAuthenticateResponse {
  /**
   * The base64-encoded DER-encoded authentication certificate of the eID user
   *
   * The public key contained in this certificate should be used to verify the signature.
   * The certificate cannot be trusted as it is received from client side and the client can submit a malicious certificate.
   * To establish trust, it must be verified that the certificate is signed by a trusted certificate authority.
   */
  unverifiedCertificate: string;

  /**
   * The algorithm used to produce the authentication token signature
   *
   * The allowed values are the algorithms specified in JWA RFC8 sections 3.3, 3.4 and 3.5
   * @see https://www.ietf.org/rfc/rfc7518.html
   */
  algorithm:
  | "ES256" | "ES384" | "ES512"  // ECDSA
  | "PS256" | "PS384" | "PS512"  // RSASSA-PSS
  | "RS256" | "RS384" | "RS512"; // RSASSA-PKCS1-v1_5,

  /**
   * The Base64-encoded authentication token signature
   */
  signature: string;

  /**
   * The type identifier and version of the authentication token format
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

export interface NativeGetSigningCertificateResponse {
  /**
   * The Base64-encoded DER-encoded signing certificate of the eID user
   */
  certificate: string;

  /**
   * The supported signature algorithm options
   */
  supportedSignatureAlgorithms: Array<SignatureAlgorithm>;
}

export interface NativeSignResponse {
  /**
   * Signature algorithm
   */
  signatureAlgorithm: SignatureAlgorithm;

  /**
   * The base64-encoded signature
   */
  signature: string;
}

export type NativeQuitResponse = Record<string, never>; // Empty object

export interface NativeFailureResponse {
  error: {
    code: string;
    message: string;
  };
}

export type NativeResponse
  = NativeStatusResponse
  | NativeAuthenticateResponse
  | NativeGetSigningCertificateResponse
  | NativeSignResponse
  | NativeFailureResponse;
