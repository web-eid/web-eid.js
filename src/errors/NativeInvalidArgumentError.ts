// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";
import DeveloperError from "./DeveloperError";

export default class NativeInvalidArgumentError extends DeveloperError {
  public code: ErrorCode;

  constructor(message = "native application received an invalid argument") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_NATIVE_INVALID_ARGUMENT;
  }
}
