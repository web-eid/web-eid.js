// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class ActionTimeoutError extends Error {
  public code: ErrorCode;

  constructor(message = "extension message timeout") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_ACTION_TIMEOUT;
  }
}
