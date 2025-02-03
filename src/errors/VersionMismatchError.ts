/*
 * Copyright (c) 2020-2024 Estonian Information System Authority
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

import ErrorCode from "./ErrorCode";
import RequiresUpdate from "../models/RequiresUpdate";
import Versions from "../models/Versions";

function tmpl(strings: TemplateStringsArray, requiresUpdate: string): string {
  return `Update required for Web-eID ${requiresUpdate}`;
}

export default class VersionMismatchError extends Error {
  public requiresUpdate: RequiresUpdate;
  public code: ErrorCode;
  public nativeApp?: string;
  public extension?: string;
  public library?: string;

  constructor(message?: string, versions?: Versions, requiresUpdate?: RequiresUpdate) {
    if (!message) {
      if (!requiresUpdate) {
        message = "requiresUpdate not provided";
      } else if (requiresUpdate.extension && requiresUpdate.nativeApp) {
        message = tmpl`${"extension and native app"}`;
      } else if (requiresUpdate.extension) {
        message = tmpl`${"extension"}`;
      } else if (requiresUpdate.nativeApp) {
        message = tmpl`${"native app"}`;
      }
    }

    super(message);

    this.name           = this.constructor.name;
    this.code           = ErrorCode.ERR_WEBEID_VERSION_MISMATCH;
    this.requiresUpdate = requiresUpdate ?? { nativeApp: false, extension: false };

    if (versions) {
      const { library, extension, nativeApp } = versions;

      Object.assign(this, { library, extension, nativeApp });
    }
  }
}
