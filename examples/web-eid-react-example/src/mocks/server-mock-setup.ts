import { setupWorker } from "msw/browser";
import authHandlers from "./handlers/auth.handlers";
import signHandlers from "./handlers/sign.handlers";

async function mockServerResponses() {
  await setupWorker(...authHandlers, ...signHandlers).start({ onUnhandledRequest: "bypass" });
}

function mockCsrfCookie() {
  const mockCsrfToken = `mock_csrf_${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16) }`;

  document.cookie = `XSRF-TOKEN=${ mockCsrfToken }; path=/; Secure; SameSite=Strict`;
}

export default async function initServerMock() {
  mockCsrfCookie();
  await mockServerResponses();
}
