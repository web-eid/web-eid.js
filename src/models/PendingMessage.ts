// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

import { ExtensionRequest } from "./message/ExtensionRequest";
import { ExtensionResponse } from "./message/ExtensionResponse";

export default interface PendingMessage {
  message:     ExtensionRequest;
  promise?:    Promise<ExtensionResponse>;
  resolve?:    (value: ExtensionResponse | PromiseLike<ExtensionResponse>) => void;
  reject?:     (reason?: Error) => void
  ackTimer?:   number;
  replyTimer?: number;
}
