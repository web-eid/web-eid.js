// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class UserCancelledError extends Error {
  public code: ErrorCode;

  constructor(message = "request was cancelled by the user") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_USER_CANCELLED;
  }
}
