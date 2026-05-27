// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

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
