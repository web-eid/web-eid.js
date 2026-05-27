// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";
import DeveloperError from "./DeveloperError";

export default class ActionPendingError extends DeveloperError {
  public code: ErrorCode;

  constructor(message = "same action for Web-eID browser extension is already pending") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_ACTION_PENDING;
  }
}
