// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

export default class DeveloperError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
