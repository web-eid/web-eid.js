import WebExtensionService from "../WebExtensionService";

describe("status", () => {
  beforeAll(() => {
    Object.defineProperty(global.window, "isSecureContext", { get: () => true });
    new WebExtensionService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log a warning from web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example warning");
  });

  it("should log multiple different warnings from separate web-eid:warning messages", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning 1"],
    }, "*");

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example warning 2"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(2);
    expect(console.warn).toBeCalledWith("example warning 1");
    expect(console.warn).toBeCalledWith("example warning 2");
  });

  it("should log multiple different warnings from a single web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: [
        "example warning 3",
        "example warning 4",
        "example warning 5",
      ],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(3);
    expect(console.warn).toBeCalledWith("example warning 3");
    expect(console.warn).toBeCalledWith("example warning 4");
    expect(console.warn).toBeCalledWith("example warning 5");
  });

  it("should not log the same message multiple times from one web-eid:warning message", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: [
        "example same warning 1",
        "example same warning 1",
      ],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example same warning 1");
  });

  it("should not log the same message multiple times from multiple web-eid:warning messages", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example same warning 2"],
    }, "*");

    window.postMessage({
      action:   "web-eid:warning",
      warnings: ["example same warning 2"],
    }, "*");

    await new Promise((resolve) => setTimeout(resolve));

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith("example same warning 2");
  });
});
