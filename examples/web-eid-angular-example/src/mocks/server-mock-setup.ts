// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT
import { setupWorker } from "msw/browser";
import authHandlers from "./handlers/auth.handlers";
import signHandlers from "./handlers/sign.handlers";

declare const WEB_EID_BACKEND_API_URL: string | undefined;

async function mockServerResponses() {
  await setupWorker(...authHandlers, ...signHandlers).start({ onUnhandledRequest: "bypass" });
}

function mockCsrfCookie() {
  if (hasConfiguredBackendApiUrl()) {
    return;
  }

  const mockCsrfToken = window.crypto.randomUUID();

  document.cookie = `XSRF-TOKEN=${ mockCsrfToken }; path=/; Secure; SameSite=Strict`;
}

function hasConfiguredBackendApiUrl() {
  return typeof WEB_EID_BACKEND_API_URL === "string" && WEB_EID_BACKEND_API_URL.trim().length > 0;
}

export default async function initServerMock() {
  mockCsrfCookie();
  await mockServerResponses();
}
