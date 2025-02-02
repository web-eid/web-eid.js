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

enum Action {
  WARNING = "web-eid:warning",

  STATUS         = "web-eid:status",
  STATUS_ACK     = "web-eid:status-ack",
  STATUS_SUCCESS = "web-eid:status-success",
  STATUS_FAILURE = "web-eid:status-failure",

  AUTHENTICATE         = "web-eid:authenticate",
  AUTHENTICATE_ACK     = "web-eid:authenticate-ack",
  AUTHENTICATE_SUCCESS = "web-eid:authenticate-success",
  AUTHENTICATE_FAILURE = "web-eid:authenticate-failure",

  GET_SIGNING_CERTIFICATE         = "web-eid:get-signing-certificate",
  GET_SIGNING_CERTIFICATE_ACK     = "web-eid:get-signing-certificate-ack",
  GET_SIGNING_CERTIFICATE_SUCCESS = "web-eid:get-signing-certificate-success",
  GET_SIGNING_CERTIFICATE_FAILURE = "web-eid:get-signing-certificate-failure",

  SIGN         = "web-eid:sign",
  SIGN_ACK     = "web-eid:sign-ack",
  SIGN_SUCCESS = "web-eid:sign-success",
  SIGN_FAILURE = "web-eid:sign-failure",
}

export type InitialAction
  = Action.STATUS
  | Action.AUTHENTICATE
  | Action.GET_SIGNING_CERTIFICATE
  | Action.SIGN;

export default Action;
