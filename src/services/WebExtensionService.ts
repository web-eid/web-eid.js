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

import { deserializeError } from "../utils/errorSerializer";
import config from "../config";
import Message from "../models/Message";
import PendingMessage from "../models/PendingMessage";
import ActionPendingError from "../errors/ActionPendingError";
import ActionTimeoutError from "../errors/ActionTimeoutError";
import ContextInsecureError from "../errors/ContextInsecureError";
import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";

export default class WebExtensionService {
  private queue: PendingMessage[] = [];

  constructor() {
    window.addEventListener("message", (event) => this.receive(event));
  }

  private receive(event: { data: Message }): void {
    const message       = event.data;
    const suffix        = message.action?.match(/success$|failure$|ack$/)?.[0];
    const initialAction = this.getInitialAction(message.action);
    const pending       = this.getPendingMessage(initialAction);

    if (suffix === "ack") {
      console.log("ack message", message);
      console.log("ack pending", pending?.message.action);
      console.log("ack queue", JSON.stringify(this.queue));
    }

    if (pending) {
      switch (suffix) {
        case "ack": {
          clearTimeout(pending.ackTimer);

          break;
        }

        case "success": {
          pending.resolve?.(message);
          this.removeFromQueue(initialAction);

          break;
        }

        case "failure": {
          pending.reject?.(message.error ? deserializeError(message.error) : message);
          this.removeFromQueue(initialAction);

          break;
        }
      }
    }
  }

  send<T extends Message>(message: Message, timeout: number): Promise<T> {
    if (this.getPendingMessage(message.action)) {
      return Promise.reject(new ActionPendingError());

    } else if (!window.isSecureContext) {
      return Promise.reject(new ContextInsecureError());

    } else {
      const pending: PendingMessage = { message };

      this.queue.push(pending);

      pending.promise = new Promise((resolve, reject) => {
        pending.resolve = resolve;
        pending.reject  = reject;
      });

      pending.ackTimer = setTimeout(
        () => this.onAckTimeout(pending),
        config.EXTENSION_HANDSHAKE_TIMEOUT,
      );

      pending.replyTimer = setTimeout(
        () => this.onReplyTimeout(pending),
        timeout,
      );

      window.postMessage(message, "*");

      return pending.promise as Promise<T>;
    }
  }

  onReplyTimeout(pending: PendingMessage): void {
    console.log("onReplyTimeout", pending.message.action);
    pending.reject?.(new ActionTimeoutError());

    this.removeFromQueue(pending.message.action);
  }

  onAckTimeout(pending: PendingMessage): void {
    console.log("onAckTimeout", pending.message.action);
    pending.reject?.(new ExtensionUnavailableError());

    clearTimeout(pending.replyTimer);
  }

  getPendingMessage(action: string): PendingMessage | undefined {
    return this.queue.find((pm) => {
      return pm.message.action === action;
    });
  }

  getSuccessAction(action: string): string {
    return `${action}-success`;
  }

  getFailureAction(action: string): string {
    return `${action}-failure`;
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
