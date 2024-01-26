/*
 * Copyright (c) 2020-2024 Estonian Information System Authority
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

import ActionPendingError from "../errors/ActionPendingError";
import ActionTimeoutError from "../errors/ActionTimeoutError";
import ContextInsecureError from "../errors/ContextInsecureError";
import ErrorCode from "../errors/ErrorCode";
import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";
import NativeFatalError from "../errors/NativeFatalError";
import NativeInvalidArgumentError from "../errors/NativeInvalidArgumentError";
import NativeUnavailableError from "../errors/NativeUnavailableError";
import UnknownError from "../errors/UnknownError";
import UserCancelledError from "../errors/UserCancelledError";
import UserTimeoutError from "../errors/UserTimeoutError";
import VersionInvalidError from "../errors/VersionInvalidError";
import VersionMismatchError from "../errors/VersionMismatchError";

const errorCodeToErrorClass: {[key: string]: any} = {
  [ErrorCode.ERR_WEBEID_ACTION_PENDING]:          ActionPendingError,
  [ErrorCode.ERR_WEBEID_ACTION_TIMEOUT]:          ActionTimeoutError,
  [ErrorCode.ERR_WEBEID_CONTEXT_INSECURE]:        ContextInsecureError,
  [ErrorCode.ERR_WEBEID_EXTENSION_UNAVAILABLE]:   ExtensionUnavailableError,
  [ErrorCode.ERR_WEBEID_NATIVE_INVALID_ARGUMENT]: NativeInvalidArgumentError,
  [ErrorCode.ERR_WEBEID_NATIVE_FATAL]:            NativeFatalError,
  [ErrorCode.ERR_WEBEID_NATIVE_UNAVAILABLE]:      NativeUnavailableError,
  [ErrorCode.ERR_WEBEID_USER_CANCELLED]:          UserCancelledError,
  [ErrorCode.ERR_WEBEID_USER_TIMEOUT]:            UserTimeoutError,
  [ErrorCode.ERR_WEBEID_VERSION_INVALID]:         VersionInvalidError,
  [ErrorCode.ERR_WEBEID_VERSION_MISMATCH]:        VersionMismatchError,
};

export function serializeError(error: any): any {
  const {
    message,
    name,
    fileName,
    lineNumber,
    columnNumber,
    stack,
  } = error;

  return {
    ...(
      Object.fromEntries(
        Object.getOwnPropertyNames(error)
          .map((prop) => [prop, error[prop]])
      )
    ),

    message,
    name,
    fileName,
    lineNumber,
    columnNumber,
    stack,
  };
}

export function deserializeError(errorObject: any): any {
  let error;

  if (typeof errorObject.code == "string" && errorObject.code in errorCodeToErrorClass) {
    const CustomError = errorCodeToErrorClass[errorObject.code];

    error = new CustomError();
  } else {
    error = new UnknownError();
  }

  for (const [key, value] of Object.entries(errorObject)) {
    error[key] = value;
  }

  return error;
}
