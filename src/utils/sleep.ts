// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

/**
 * Sleeps for a specified time before resolving the returned promise.
 *
 * @param milliseconds Time in milliseconds until the promise is resolved
 *
 * @returns Empty promise
 */
export default function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}
