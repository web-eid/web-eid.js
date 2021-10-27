import ExtensionUnavailableError from "../errors/ExtensionUnavailableError";
import AuthenticateOptions from "../models/AuthenticateOptions";
import SignOptions from "../models/SignOptions";
import * as webeid from "../web-eid";

Object.defineProperty(global.window, "isSecureContext", { get: () => true });

describe("status", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    await expect(webeid.status()).rejects.toThrow(ExtensionUnavailableError);
  });


  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    try { await webeid.status(); } catch (e) { /* ignore */ }

    expect(window.postMessage).toBeCalledTimes(1);
    expect(window.postMessage).toBeCalledWith(
      {
        action:         "web-eid:status",
        libraryVersion: process.env.npm_package_version,
      },
      "*",
    );
  });

  it("should return library, extension and app versions", async () => {
    const statusPromise = webeid.status();

    window.postMessage({
      action: "web-eid:status-ack",
    }, "*");

    window.postMessage({
      action:    "web-eid:status-success",
      extension: process.env.npm_package_version,
      nativeApp: process.env.npm_package_version,
    }, "*");

    expect(await statusPromise).toMatchObject({
      library:   process.env.npm_package_version,
      extension: process.env.npm_package_version,
      nativeApp: process.env.npm_package_version,
    });
  });
});

describe("authenticate", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    const options: AuthenticateOptions = {
      getAuthChallengeUrl:    "https://test/challenge",
      postAuthTokenUrl:       "https://test/token",
      userInteractionTimeout: 1,
      serverRequestTimeout:   1,
    };

    await expect(webeid.authenticate(options)).rejects.toThrow(ExtensionUnavailableError);
  });

  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const options: AuthenticateOptions = {
      getAuthChallengeUrl:    "https://test/challenge",
      postAuthTokenUrl:       "https://test/token",
      userInteractionTimeout: 1,
      serverRequestTimeout:   1,
    };

    try { await webeid.authenticate(options); } catch (e) { /* ignore */ }

    expect(window.postMessage).toBeCalledTimes(1);
    expect(window.postMessage).toBeCalledWith(
      {
        action:                 "web-eid:authenticate",
        getAuthChallengeUrl:    "https://test/challenge",
        postAuthTokenUrl:       "https://test/token",
        userInteractionTimeout: 1,
        serverRequestTimeout:   1,
        libraryVersion:         process.env.npm_package_version,
      },
      "*",
    );
  });
});


describe("sign", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw ExtensionUnavailableError on request timeout", async () => {
    const options: SignOptions = {
      postPrepareSigningUrl:  "https://test/prepare",
      postFinalizeSigningUrl: "https://test/finalize",
      userInteractionTimeout: 1,
      serverRequestTimeout:   1,
    };

    await expect(webeid.sign(options)).rejects.toThrow(ExtensionUnavailableError);
  });

  it("should include library version with message to extension", async () => {
    jest.spyOn(window, "postMessage").mockImplementation();

    const options: SignOptions = {
      postPrepareSigningUrl:  "https://test/prepare",
      postFinalizeSigningUrl: "https://test/finalize",
      userInteractionTimeout: 1,
      serverRequestTimeout:   1,
    };

    try { await webeid.sign(options); } catch (e) { /* ignore */ }

    expect(window.postMessage).toBeCalledTimes(1);
    expect(window.postMessage).toBeCalledWith(
      {
        action:                 "web-eid:sign",
        postPrepareSigningUrl:  "https://test/prepare",
        postFinalizeSigningUrl: "https://test/finalize",
        userInteractionTimeout: 1,
        serverRequestTimeout:   1,
        libraryVersion:         process.env.npm_package_version,
      },
      "*",
    );
  });
});
