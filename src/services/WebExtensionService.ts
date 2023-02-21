/*
 * Copyright (c) 2020-2023 Estonian Information System Authority
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

import {
  ExtensionFailureResponse,
  ExtensionResponse,
} from "../models/message/ExtensionResponse";

import Action from "../models/Action";
import ActionPendingError from "../errors/ActionPendingError";
import ActionTimeoutError from "../errors/ActionTimeoutError";
import ContextInsecureError from "../errors/ContextInsecureError";
import { ExtensionRequest } from "../models/message/ExtensionRequest";
import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";
import PendingMessage from "../models/PendingMessage";
import config from "../config";
import { deserializeError } from "../utils/errorSerializer";

export default class WebExtensionService {
  private loggedWarnings: Array<string> = [];
  private queue: Array<PendingMessage> = [];

  constructor() {
    window.addEventListener("message", (event) => this.receive(event));
  }

  private receive(event: { data: ExtensionResponse }): void {
    if (!/^web-eid:/.test(event.data?.action)) return;

    const message       = event.data;
    const suffix        = message.action?.match(/success$|failure$|ack$/)?.[0];
    const initialAction = this.getInitialAction(message.action);
    const pending       = this.getPendingMessage(initialAction);

    if (message.action === Action.WARNING) {
      message.warnings?.forEach((warning: string) => {
        if (!this.loggedWarnings.includes(warning)) {
          this.loggedWarnings.push(warning);
          console.warn(warning.replace(/\n|\r/g, ""));
        }
      });
    } else if (pending) {
      switch (suffix) {
        case "ack": {
          clearTimeout(pending.ackTimer);

          break;
        }

        case "success": {
          this.removeFromQueue(initialAction);
          pending.resolve?.(message);

          break;
        }

        case "failure": {
          const failureMessage = message as ExtensionFailureResponse;

          this.removeFromQueue(initialAction);
          pending.reject?.(failureMessage.error ? deserializeError(failureMessage.error) : failureMessage);

          break;
        }
      }
    }
  }

  send<T extends ExtensionResponse>(message: ExtensionRequest, timeout: number): Promise<T> {
    if (this.getPendingMessage(message.action)) {
      return Promise.reject(new ActionPendingError());

    } else if (!window.isSecureContext) {
      return Promise.reject(new ContextInsecureError());

    } else {
      const pending: PendingMessage = { message };

      this.queue.push(pending);

      pending.promise = new Promise<ExtensionResponse>((resolve, reject) => {
        pending.resolve = resolve;
        pending.reject  = reject;
      });

      pending.ackTimer = window.setTimeout(
        () => this.onAckTimeout(pending),
        config.EXTENSION_HANDSHAKE_TIMEOUT,
      );

      pending.replyTimer = window.setTimeout(
        () => this.onReplyTimeout(pending),
        timeout,
      );

      window.postMessage(message, "*");

      return pending.promise as Promise<T>;
    }
  }

  onReplyTimeout(pending: PendingMessage): void {
    this.removeFromQueue(pending.message.action);
    pending.reject?.(new ActionTimeoutError());
  }

  onAckTimeout(pending: PendingMessage): void {
    clearTimeout(pending.replyTimer);
    this.removeFromQueue(pending.message.action);
    pending.reject?.(new ExtensionUnavailableError());
  }

  getPendingMessage(action: string): PendingMessage | undefined {
    return this.queue.find((pm) => {
      return pm.message.action === action;
    });
  }

  getInitialAction(action: string): string {
    return action.replace(/-success$|-failure$|-ack$/, "");
  }

  removeFromQueue(action: string): void {
    const pending = this.getPendingMessage(action);

    clearTimeout(pending?.replyTimer);

    this.queue = this.queue.filter((pending) => (
      pending.message.action !== action
    ));
  }
}
