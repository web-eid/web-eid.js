// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

export default Object.freeze({
  VERSION:                          "2.1.0",
  EXTENSION_HANDSHAKE_TIMEOUT:      1000,          // 1 second
  NATIVE_APP_HANDSHAKE_TIMEOUT:     5 * 1000,      // 5 seconds
  DEFAULT_USER_INTERACTION_TIMEOUT: 2 * 60 * 1000, // 2 minutes
  MAX_EXTENSION_LOAD_DELAY:         1000,          // 1 second
});
