// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

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
