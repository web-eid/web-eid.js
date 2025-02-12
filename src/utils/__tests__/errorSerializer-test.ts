/*
 * Copyright (c) 2020-2025 Estonian Information System Authority
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
  serializeError,
  deserializeError
} from ".././errorSerializer";

import ActionPendingError from "../../errors/ActionPendingError";
import ActionTimeoutError from "../../errors/ActionTimeoutError";
import UnknownError from "../../errors/UnknownError";
import UserCancelledError from "../../errors/UserCancelledError";
import VersionMismatchError from "../../errors/VersionMismatchError";

import ErrorCode from "../../errors/ErrorCode";
import { SerializedError } from "../../errors/SerializedError";
import RequiresUpdate from "../../models/RequiresUpdate";
import Versions from "../../models/Versions";

describe("errorSerializer", () => {
  describe("serializeError", () => {
    it("should serialize a known custom error (ActionPendingError)", () => {
      const originalError = new ActionPendingError("Custom message");
      const serialized    = serializeError(originalError);

      expect(serialized).toHaveProperty("name", "ActionPendingError");
      expect(serialized).toHaveProperty("message", "Custom message");
      expect(serialized).toHaveProperty("code", ErrorCode.ERR_WEBEID_ACTION_PENDING);
      expect(typeof serialized.stack).toBe("string");
      expect(serialized.stack?.length).toBeGreaterThan(0);
    });

    it("should serialize a built-in Error as UnknownError", () => {
      const builtInError = new Error("Built-in error message");
      const serialized   = serializeError(builtInError);

      expect(serialized.name).toBe("UnknownError");
      expect(serialized.message).toBe("Built-in error message");
      expect(serialized.code).toBe(ErrorCode.ERR_WEBEID_UNKNOWN_ERROR);
      expect(typeof serialized.stack).toBe("string");
    });

    it("should serialize a non-error object as UnknownError", () => {
      const nonError = "I am just a string, not an Error object";
      const serialized = serializeError(nonError as unknown as Error);

      expect(serialized).toHaveProperty("name", "UnknownError");
      expect(serialized).toHaveProperty("code", ErrorCode.ERR_WEBEID_UNKNOWN_ERROR);
      expect(serialized).toHaveProperty("message", nonError);
      expect(typeof serialized.stack).toBe("string");
    });

    it("should preserve extra properties on the error object", () => {
      interface ActionTimeoutErrorWithExtra extends ActionTimeoutError {
        nestedObject: { foo: string },
        customField: number,
      };

      const errorWithExtras = new ActionTimeoutError("Timeout with extras") as ActionTimeoutErrorWithExtra;

      errorWithExtras.nestedObject = { foo: "bar" };
      errorWithExtras.customField  = 42;

      const serialized = serializeError(errorWithExtras);

      expect(serialized).toHaveProperty("customField", 42);
      expect(serialized).toHaveProperty("nestedObject");
      expect(serialized.nestedObject).toEqual({ foo: "bar" });
    });

    it("should use stack trace from parent Error class when not directly available", () => {
      const error  = new ActionTimeoutError();
      const parent = Object.getPrototypeOf(error) as Error;

      error.stack  = "ActionTimeoutError stack trace";
      parent.stack = "Error stack trace";

      const serializedWithDirectStack = serializeError(error);

      delete error.stack;
      const serializedWithParentStack = serializeError(error);

      expect(serializedWithDirectStack).toHaveProperty("stack", "ActionTimeoutError stack trace");
      expect(serializedWithParentStack).toHaveProperty("stack", "Error stack trace");
    });

    it("should use name from parent Error class when not directly available", () => {
      const error  = new ActionTimeoutError();

      error.name  = "ActionTimeoutError";

      const serializedWithDirectName = serializeError(error);

      const errorAsObject = error as unknown as Record<string, unknown>;
      delete errorAsObject.name;
      const serializedWithParentName = serializeError(error);

      expect(serializedWithDirectName).toHaveProperty("name", "ActionTimeoutError");
      expect(serializedWithParentName).toHaveProperty("name", "Error");
    });
  });

  describe("deserializeError", () => {
    it("should deserialize a valid serialized error (ActionPendingError) to the correct instance", () => {
      const originalError = new ActionPendingError("Pending error message");
      const serialized    = serializeError(originalError);
      const deserialized  = deserializeError(serialized);

      expect(deserialized).toBeInstanceOf(ActionPendingError);
      expect(deserialized.message).toBe("Pending error message");
      expect(deserialized.code).toBe(ErrorCode.ERR_WEBEID_ACTION_PENDING);
      expect(deserialized.stack).toBe(serialized.stack);
    });

    it("should return UnknownError if the serialized object does not match the SerializedError interface", () => {
      const invalidObj = { foo: "bar" } as unknown as SerializedError;
      const deserialized = deserializeError(invalidObj);

      expect(deserialized).toBeInstanceOf(UnknownError);
      expect(deserialized.code).toBe(ErrorCode.ERR_WEBEID_UNKNOWN_ERROR);
    });

    it("should return UnknownError if 'code' does not match known error types", () => {
      const fakeCodeError: SerializedError = {
        code: "FAKE_CODE" as ErrorCode,
        message: "Some fake code error",
        name: "FakeError",
        stack: "fake stack",
      };

      const deserialized = deserializeError(fakeCodeError);

      expect(deserialized).toBeInstanceOf(UnknownError);
      expect(deserialized.code).toBe(ErrorCode.ERR_WEBEID_UNKNOWN_ERROR);
      expect(deserialized.message).toBe("Some fake code error");
    });

    it("should preserve extra properties when deserializing", () => {
      interface UserCancelledErrorWithExtra extends UserCancelledError {
        nestedObject: { foo: string },
        customField: number,
      }

      const originalError = new UserCancelledError("User cancelled") as UserCancelledErrorWithExtra;
      originalError.nestedObject = { foo: "bar" };
      originalError.customField  = 42;

      const serialized   = serializeError(originalError);
      const deserialized = deserializeError(serialized) as UserCancelledErrorWithExtra;

      expect(deserialized).toBeInstanceOf(UserCancelledError);
      expect(deserialized).toHaveProperty("customField", 42);
      expect(deserialized).toHaveProperty("nestedObject");
      expect(deserialized.nestedObject).toEqual({ foo: "bar" });
    });

    it("should deserialize VersionMismatchError with requiresUpdate and version fields", () => {
      const requiresUpdate: RequiresUpdate = { nativeApp: true, extension: false };
      const versions: Versions = {
        library: "1.0.0",
        nativeApp: "0.9.0",
        extension: "1.0.0",
      };

      const originalError = new VersionMismatchError(
        "Update required for native app",
        versions,
        requiresUpdate
      );

      const serialized   = serializeError(originalError);
      const deserialized = deserializeError(serialized) as VersionMismatchError;

      expect(deserialized).toBeInstanceOf(VersionMismatchError);
      expect(deserialized.requiresUpdate).toEqual({ nativeApp: true, extension: false });
      expect(deserialized.library).toBe("1.0.0");
      expect(deserialized.nativeApp).toBe("0.9.0");
      expect(deserialized.extension).toBe("1.0.0");
    });

    it("should instantiate UnknownError when serialized object is missing required fields", () => {
      let partialError: Partial<SerializedError>;

      partialError = {
        code: ErrorCode.ERR_WEBEID_USER_CANCELLED,
        name: "UserCancelledError",
        message: "User cancelled something",
        stack: "<dummy trace>",
      };
      expect(deserializeError(partialError as SerializedError)).toBeInstanceOf(UserCancelledError);

      partialError = {
        code: ErrorCode.ERR_WEBEID_USER_CANCELLED,
        name: "UserCancelledError",
        message: "User cancelled something",
      };
      expect(deserializeError(partialError as SerializedError)).toBeInstanceOf(UserCancelledError);

      partialError = {
        code: ErrorCode.ERR_WEBEID_USER_CANCELLED,
        message: "User cancelled something",
        stack: "<dummy trace>",
      };
      expect(deserializeError(partialError as SerializedError)).toBeInstanceOf(UserCancelledError);

      partialError = {
        code: ErrorCode.ERR_WEBEID_USER_CANCELLED,
        name: "UserCancelledError",
        stack: "<dummy trace>",
      };
      expect(deserializeError(partialError as SerializedError)).toBeInstanceOf(UnknownError);

      partialError = {
        name: "UserCancelledError",
        message: "User cancelled something",
        stack: "<dummy trace>",
      };
      expect(deserializeError(partialError as SerializedError)).toBeInstanceOf(UnknownError);
    });
  });
});
