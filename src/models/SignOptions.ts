/*
 * Copyright (c) 2020 The Web eID Project
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

export default interface SignOptions {
  /**
   * Prepare document for signing POST request URL
   *
   * This request provides the signing certificate in the request body,
   * the backend service should prepare the document for signing
   * and return the document `hash` and `algorithm` of the hash, optionally arbitrary additional data.
   */
  postPrepareSigningUrl: string;

  /**
   * Signature POST request URL
   *
   * This request provides the document `hash`, `signature` and optionally additional data, the backend service should
   * sign the document and optionally return any JSON payload to be returned by webeid.sign(...)
   */
  postFinalizeSigningUrl: string;

  /**
   * Headers to append to the requests.
   */
  headers?: {
    [key: string]: string;
  };

  /**
   * Time in milliseconds before a user interaction, for example PIN entry, times out.
   *
   * When not specified, defaults to 2 minutes.
   */
  userInteractionTimeout?: number;

  /**
   * Time in milliseconds before a server request, for example prepare signing request, times out.
   *
   * When not specified, defaults to 20 seconds.
   */
  serverRequestTimeout?: number;

  /**
   * A two-letter ISO 639-1 language code.
   *
   * If translations exist for the given language, then the user interface will be displayed in this language.
   */
  lang?: string;
}
