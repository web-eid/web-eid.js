// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";
import DeveloperError from "./DeveloperError";

export default class MissingParameterError extends DeveloperError {
  public code: ErrorCode;

  constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_MISSING_PARAMETER;
  }
}
