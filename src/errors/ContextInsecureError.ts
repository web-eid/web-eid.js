// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

const SECURE_CONTEXTS_INFO_URL = "https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts";

export default class ContextInsecureError extends Error {
  public code: ErrorCode;

  constructor(message = "Secure context required, see " + SECURE_CONTEXTS_INFO_URL) {
    super(message);

    this.name = this.constructor.name;
    this.code = ErrorCode.ERR_WEBEID_CONTEXT_INSECURE;
  }
}
