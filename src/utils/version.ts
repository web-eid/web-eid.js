/*
 * Copyright (c) Estonian Information System Authority
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Versions from "../models/Versions";
import { parseSemver, compareSemver, IdentifierDiff } from "./semver";
import UpdateRequired from "../models/RequiresUpdate";

/**
 * Checks if update is required.
 *
 * @param version Object containing SemVer version strings for library, extension and native app.
 *
 * @returns Object which specifies if the extension or native app should be updated.
 */
export function checkCompatibility(version: Versions): UpdateRequired {
  const library   = parseSemver(version.library);
  const extension = parseSemver(version.extension);
  const nativeApp = parseSemver(version.nativeApp);

  const extensionDiff = compareSemver(extension, library);
  const nativeAppDiff = compareSemver(nativeApp, library);

  return {
    extension: extensionDiff.major === IdentifierDiff.OLDER,
    nativeApp: nativeAppDiff.major === IdentifierDiff.OLDER,
  };
}

/**
 * Checks an object if 'library', 'extension' or 'nativeApp' properties are present.
 * Values are not checked for SemVer validity.
 *
 * @param object Object which will be checked for version properties.
 *
 * @returns Were any of the version properties found in the provided object.
 */
export function hasVersionProperties(object: any): boolean {
  if (typeof object === "object") {
    for (const prop of ["library", "extension", "nativeApp"]) {
      if (Object.hasOwnProperty.call(object, prop)) return true;
    }
  }

  return false;
}
