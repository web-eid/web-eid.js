// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class UserTimeoutError extends Error {
  public code: ErrorCode;

  constructor(message = "user failed to respond in time") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_USER_TIMEOUT;
  }
}
