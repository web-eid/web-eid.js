import { setupWorker } from "msw/browser";
import authHandlers from "./handlers/auth.handlers";
import signHandlers from "./handlers/sign.handlers";

async function mockServerResponses() {
  await setupWorker(...authHandlers, ...signHandlers).start({ onUnhandledRequest: "bypass" });
}

function mockCsrfCookie() {
  const mockCsrfToken = window.crypto.randomUUID();

  document.cookie = `XSRF-TOKEN=${ mockCsrfToken }; path=/; Secure; SameSite=Strict`;
}

export default async function initServerMock() {
  mockCsrfCookie();
  await mockServerResponses();
}
