// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

export default interface ActionOptions {
  /**
   * Time in milliseconds before a user interaction, for example PIN entry, times out.
   *
   * When not specified, defaults to 2 minutes.
   */
  userInteractionTimeout?: number;

  /**
   * A two-letter ISO 639-1 language code.
   *
   * If translations exist for the given language, then the user interface will be displayed in this language.
   */
  lang?: string;
}
