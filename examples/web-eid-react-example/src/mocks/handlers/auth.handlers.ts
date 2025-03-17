import { http, HttpResponse } from "msw";

interface LoginRequestBody {
  "auth-token": {
    algorithm: string;
    appVersion: string;
    format: string;
    signature: string;
    unverifiedCertificate: string;
  };
}

interface LoginResponseBody {
  sub: string,
  auth: string,
}

const mockBackendStore = {
  get activeSessions() {
    return JSON.parse(sessionStorage.getItem("activeSessions") ?? "[]");
  },

  addActiveSession(sessionId: string) {
    const activeSessions = this.activeSessions;

    activeSessions.push(sessionId);

    sessionStorage.setItem("activeSessions", JSON.stringify(activeSessions));
  },

  removeActiveSession(sessionId: string) {
    const activeSessions = this.activeSessions.filter((id: string) => id !== sessionId);

    sessionStorage.setItem("activeSessions", JSON.stringify(activeSessions));
  }
}

export default [
  http.get("/auth/user", async ({ cookies }) => {
    console.group("auth/user");
    console.log("cookies", cookies);
    console.log("activeSessions", mockBackendStore.activeSessions);
    console.groupEnd();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isLoggedIn = mockBackendStore.activeSessions.includes(cookies["session"]);

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (isLoggedIn) {
      return HttpResponse.json(user);
    } else {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }),

  http.get("/auth/challenge", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return HttpResponse.json({ "nonce": generateNonce() });
  }),

  http.post<never, LoginRequestBody, LoginResponseBody>("/auth/login", async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const unverifiedCertificate = (await request.json())["auth-token"]?.unverifiedCertificate;

    const person = getPersonFromCert(unverifiedCertificate);

    const user = {
      sub: `${person.firstname} ${person.lastname}`,
      auth: "[ROLE_USER]"
    };

    sessionStorage.setItem("user", JSON.stringify(user));

    const sessionId = `mock-logged-in-${ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16) }`;

    mockBackendStore.addActiveSession(sessionId);

    return HttpResponse.json(user, {
      headers: { "Set-Cookie": `session=${sessionId}; Path=/; Secure; SameSite=Strict` },
    })
  }),

  http.post("/auth/logout", async ({ cookies }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    sessionStorage.clear();

    const sessionId = cookies["session"];

    mockBackendStore.removeActiveSession(sessionId);

    return HttpResponse.json(null, {
      headers: { "Set-Cookie": `session=mock-expired; expires=${ new Date(0).toUTCString() }` }
    })
  }),
];

function generateNonce() {
  const bytes = new Uint8Array(32);

  window.crypto.getRandomValues(bytes);

  const binaryString = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");

  return btoa(binaryString);
}

/**
 * Attempts to extract person details from the certificate.
 * This method is unreliable and only made for mocking purposes.
 */
function getPersonFromCert(certificate: string) {
  const data = atob(certificate);
  const decoder = new TextDecoder("utf-8");

  const ranges = (
    data
      .split("")
      .map((byte, i, data) => byte == "\f" ? [i + 2, data[i + 1].charCodeAt(0)] : null)
      .filter((meta) => meta != null)
  );

  const strings = ranges.map(([start, len]) => {
    const rawString = data.slice(start, start + len);

    const bytes = new Uint8Array(rawString.length);
    for (let j = 0; j < rawString.length; j++) {
      bytes[j] = rawString.charCodeAt(j);
    }

    return decoder.decode(bytes);
  });

  const person = strings.filter((str) => /^.*,.*,\d*$/.test(str))[0];

  const [lastname, firstname, ssn] = (
    person?.length
      ? person.split(",")
      : ["Dummy", "Test", "38001085718"]
  );

  return {
    firstname,
    lastname,
    ssn,
  };
}
