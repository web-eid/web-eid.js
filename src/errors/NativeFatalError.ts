// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class NativeFatalError extends Error {
  public code: ErrorCode;

  constructor(message = "native application terminated with a fatal error") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_NATIVE_FATAL;
  }
}
