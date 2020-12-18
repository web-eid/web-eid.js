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

export default interface HttpResponse {
  /**
   * The HTTP request's response headers.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/headers
   */
  headers: object;

  /**
   * A boolean indicating whether the response
   * was successful (status in the range 200–299) or not.
   */
  ok: boolean;

  /**
   * Indicates whether or not the response is the result of a redirect.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected
   */
  redirected: boolean;

  /**
   * The status code of the response. (This will be 200 for a success).
   */
  status: number;

  /**
   * The status message corresponding to the status code. (e.g., OK for 200).
   */
  statusText: string;

  /**
   * The type of the response (e.g., basic, cors).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
   */
  type: string;

  /**
   * The URL of the response.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/url
   */
  url: string;

  /**
   * Response body. Can be an object deserialized from JSON or plain text.
   */
  body: object | string;
}
