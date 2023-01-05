/*
 * Copyright (c) 2020-2023 Estonian Information System Authority
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

enum ErrorCode {
  // Timeout errors
  ERR_WEBEID_ACTION_TIMEOUT = "ERR_WEBEID_ACTION_TIMEOUT",
  ERR_WEBEID_USER_TIMEOUT   = "ERR_WEBEID_USER_TIMEOUT",

  // Health errors
  ERR_WEBEID_VERSION_MISMATCH      = "ERR_WEBEID_VERSION_MISMATCH",
  ERR_WEBEID_VERSION_INVALID       = "ERR_WEBEID_VERSION_INVALID",
  ERR_WEBEID_EXTENSION_UNAVAILABLE = "ERR_WEBEID_EXTENSION_UNAVAILABLE",
  ERR_WEBEID_NATIVE_UNAVAILABLE    = "ERR_WEBEID_NATIVE_UNAVAILABLE",
  ERR_WEBEID_UNKNOWN_ERROR         = "ERR_WEBEID_UNKNOWN_ERROR",

  // Security errors
  ERR_WEBEID_CONTEXT_INSECURE = "ERR_WEBEID_CONTEXT_INSECURE",

  // Third party errors
  ERR_WEBEID_USER_CANCELLED          = "ERR_WEBEID_USER_CANCELLED",
  ERR_WEBEID_NATIVE_INVALID_ARGUMENT = "ERR_WEBEID_NATIVE_INVALID_ARGUMENT",
  ERR_WEBEID_NATIVE_FATAL            = "ERR_WEBEID_NATIVE_FATAL",

  // Developer mistakes
  ERR_WEBEID_ACTION_PENDING    = "ERR_WEBEID_ACTION_PENDING",
  ERR_WEBEID_MISSING_PARAMETER = "ERR_WEBEID_MISSING_PARAMETER",
}

export default ErrorCode;
