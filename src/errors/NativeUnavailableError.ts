// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class NativeUnavailableError extends Error {
  public code: ErrorCode;

  constructor(message = "Web-eID native application is not available") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_NATIVE_UNAVAILABLE;
  }
}
