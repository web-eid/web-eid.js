// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export default class ExtensionUnavailableError extends Error {
  public code: ErrorCode;

  constructor(message = "Web-eID extension is not available") {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_EXTENSION_UNAVAILABLE;
  }
}
