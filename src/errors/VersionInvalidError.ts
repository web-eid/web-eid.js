// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class VersionInvalidError extends Error {
  public code: ErrorCode;

  constructor(message = "invalid version string") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_VERSION_INVALID;
  }
}
