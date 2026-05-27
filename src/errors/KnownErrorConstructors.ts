// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import ActionPendingError from "./ActionPendingError";
import ActionTimeoutError from "./ActionTimeoutError";
import ContextInsecureError from "./ContextInsecureError";
import ExtensionUnavailableError from "./ExtensionUnavailableError";
import MissingParameterError from "./MissingParameterError";
import NativeFatalError from "./NativeFatalError";
import NativeInvalidArgumentError from "./NativeInvalidArgumentError";
import NativeUnavailableError from "./NativeUnavailableError";
import UnknownError from "./UnknownError";
import UserCancelledError from "./UserCancelledError";
import UserTimeoutError from "./UserTimeoutError";
import VersionInvalidError from "./VersionInvalidError";
import VersionMismatchError from "./VersionMismatchError";

type KnownErrorConstructors
  = typeof ActionPendingError
  | typeof ActionTimeoutError
  | typeof ContextInsecureError
  | typeof ExtensionUnavailableError
  | typeof MissingParameterError
  | typeof NativeInvalidArgumentError
  | typeof NativeFatalError
  | typeof NativeUnavailableError
  | typeof UserCancelledError
  | typeof UserTimeoutError
  | typeof VersionInvalidError
  | typeof VersionMismatchError
  | typeof UnknownError;

export default KnownErrorConstructors;
