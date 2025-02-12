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

import { SerializedError } from "../errors/SerializedError";

import ActionPendingError from "../errors/ActionPendingError";
import ActionTimeoutError from "../errors/ActionTimeoutError";
import ContextInsecureError from "../errors/ContextInsecureError";
import ErrorCode from "../errors/ErrorCode";
import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";
import KnownErrorConstructors from "../errors/KnownErrorConstructors";
import MissingParameterError from "../errors/MissingParameterError";
import NativeFatalError from "../errors/NativeFatalError";
import NativeInvalidArgumentError from "../errors/NativeInvalidArgumentError";
import NativeUnavailableError from "../errors/NativeUnavailableError";
import UnknownError from "../errors/UnknownError";
import UserCancelledError from "../errors/UserCancelledError";
import UserTimeoutError from "../errors/UserTimeoutError";
import VersionInvalidError from "../errors/VersionInvalidError";
import VersionMismatchError from "../errors/VersionMismatchError";

const errorCodeToErrorClass: Record<keyof typeof ErrorCode, KnownErrorConstructors> = {
  [ErrorCode.ERR_WEBEID_ACTION_PENDING]:          ActionPendingError,
  [ErrorCode.ERR_WEBEID_ACTION_TIMEOUT]:          ActionTimeoutError,
  [ErrorCode.ERR_WEBEID_CONTEXT_INSECURE]:        ContextInsecureError,
  [ErrorCode.ERR_WEBEID_EXTENSION_UNAVAILABLE]:   ExtensionUnavailableError,
  [ErrorCode.ERR_WEBEID_MISSING_PARAMETER]:       MissingParameterError,
  [ErrorCode.ERR_WEBEID_NATIVE_INVALID_ARGUMENT]: NativeInvalidArgumentError,
  [ErrorCode.ERR_WEBEID_NATIVE_FATAL]:            NativeFatalError,
  [ErrorCode.ERR_WEBEID_NATIVE_UNAVAILABLE]:      NativeUnavailableError,
  [ErrorCode.ERR_WEBEID_USER_CANCELLED]:          UserCancelledError,
  [ErrorCode.ERR_WEBEID_USER_TIMEOUT]:            UserTimeoutError,
  [ErrorCode.ERR_WEBEID_VERSION_INVALID]:         VersionInvalidError,
  [ErrorCode.ERR_WEBEID_VERSION_MISMATCH]:        VersionMismatchError,
  [ErrorCode.ERR_WEBEID_UNKNOWN_ERROR]:           UnknownError,
};

export function serializeError(error: Error): SerializedError {
  if (!(error instanceof Error)) {
    error = new UnknownError(typeof error == "string" ? error : undefined);
  }

  const result: Record<string, unknown> = {};

  for (const prop of Object.getOwnPropertyNames(error)) {
    Reflect.set(result, prop, Reflect.get(error, prop));
  }

  for (const key of ["name", "stack"]) {
    const errorAsObject = (error as unknown as Record<string, unknown>);
    if (!result[key] && errorAsObject?.[key] != null) {
      Reflect.set(result, key, errorAsObject[key]);
    }
  }

  if (!result.code) {
    result.code = ErrorCode.ERR_WEBEID_UNKNOWN_ERROR;
    result.name = UnknownError.name;
  }

  return result as SerializedError;
}

function isSerializedError(obj: unknown): obj is SerializedError {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const errorObject = obj as SerializedError;

  return (
    typeof errorObject.code    === "string" &&
    typeof errorObject.message === "string" &&

    errorCodeToErrorClass[errorObject.code] != null
  );
}

export function deserializeError(errorObject: SerializedError): InstanceType<KnownErrorConstructors> {
  let error: InstanceType<KnownErrorConstructors>;

  if (isSerializedError(errorObject)) {
    const CustomError = errorCodeToErrorClass[errorObject.code];

    error = new CustomError();

    Object.entries(errorObject).forEach(([key, value]) => {
      Reflect.set(error, key, value);
    });
  } else {
    error = new UnknownError();

    const unknownObject = (errorObject as { stack?: string, message?: string });

    if (unknownObject?.stack)   error.stack   = unknownObject.stack;
    if (unknownObject?.message) error.message = unknownObject.message;
  }

  return error;
}
