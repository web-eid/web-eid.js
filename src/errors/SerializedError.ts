// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ErrorCode from "./ErrorCode";

export interface SerializedError {
  code: ErrorCode;
  message: string;
  name?: string;
  stack?: string;

  [key: string]: unknown; // allow extra properties
}
