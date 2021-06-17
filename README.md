# web-eid.js

![European Regional Development Fund](https://github.com/open-eid/DigiDoc4-Client/blob/master/client/images/EL_Regionaalarengu_Fond.png)

`web-eid.js` — add secure authentication and digital signing with electronic ID smart cards to
web applications with the Web eID JavaScript library. `web-eid.js`
is a thin wrapper on top of the messaging interface provided by the Web eID
browser extension.

## Quickstart

Complete the three steps below to add secure authentication and digital signing
support to your web application front end. Instructions for the back end are
available [here](https://github.com/web-eid/web-eid-authtoken-validation-java).

To run this quickstart you need a modern web application that uses NPM to
manage JavaScript packages.

See full example [here](https://github.com/web-eid/web-eid-spring-boot-example).

### 1. Add web-eid.js to the project

1. Run the following command to install the library using NPM:
    ```bash
    echo '@web-eid:registry=https://gitlab.com/api/v4/packages/npm' >> .npmrc
    npm install @web-eid/web-eid-library
    ```

2. Configure the web server to expose `node_modules/web-eid/dist/es/web-eid.js`

See below for alternative installation options.

### 2. Add authentication support

Copy the following code to the authentication page of your web application,
amending `options` according to your back end configuration:

```html
<p>
    <button id="webeid-auth-button">Authenticate</button>
</p>

<script type="module">
    import * as webeid from 'web-eid.js';

    const authButton = document.querySelector("#webeid-auth-button");

    authButton.addEventListener("click", async () => {
        const options = {
            getAuthChallengeUrl: window.location.origin + "/auth/challenge",
            postAuthTokenUrl: window.location.origin + "/auth/login"
        };

        try {
            const response = await webeid.authenticate(options);
            console.log("Authentication successful! Response:", response);

            window.location.href = "/welcome";

        } catch (error) {
            console.log("Authentication failed! Error:", error);
            throw error;
        }
    });
</script>
```

See below for `options` description.

### 3. Add digital signing support

Copy the following code to the digital signing page of your web application,
amending `options` according to your back end configuration:

```html
<p>
    <button id="webeid-sign-button">Sign document</button>
</p>

<script type="module">
    import * as webeid from 'web-eid.js';

    const signButton = document.querySelector("#webeid-sign-button");

    signButton.addEventListener("click", async () => {
        const options = {
            postPrepareSigningUrl: window.location.origin + "/sign/prepare",
            postFinalizeSigningUrl: window.location.origin + "/sign/sign"
        };

        try {
            const response = await webeid.sign(options);
            console.log("Signing successful! Response:", response);
            // display successful signing message to user

        } catch (error) {
            console.log("Signing failed! Error:", error);
            throw error;
        }
    });
    </script>
```

See below for `options` description.

### 4. Test it out

1. Install Web eID by downloading and running [the Web eID installer](https://web-eid.eu) for your operating system.
2. Make sure that the Web eID browser extension is enabled.
3. Start your web appliction.
4. Web eID requires HTTPS. If your web application does not have HTTPS support, use e.g. [ngrok](https://ngrok.com/) to add it.
5. Open the HTTPS URL in the browser, attach a smart card reader, insert the electronic ID card and try out authentication and signing.

## Table of contents

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Quickstart](#quickstart)
- [Install](#install)
  - [Without a module system](#without-a-module-system)
  - [ES module for server-side build tools](#es-module-for-server-side-build-tools)
  - [ES module for browsers](#es-module-for-browsers)
  - [UMD module for AMD and browser-side CommonJS module loaders](#umd-module-for-amd-and-browser-side-commonjs-module-loaders)
- [API](#api)
  - [Status](#status)
    - [Status parameters](#status-parameters)
    - [Status returns](#status-returns)
    - [Status example - check using async-await](#status-example-check-using-async-await)
    - [Status example - check using promises](#status-example-check-using-promises)
    - [Status example - success](#status-example-success)
    - [Status example - failure](#status-example-failure)
  - [Authenticate](#authenticate)
    - [Authenticate parameters](#authenticate-parameters)
    - [Authenticate returns](#authenticate-returns)
    - [Authenticate example - using async-await](#authenticate-example-using-async-await)
    - [Authenticate example - using promises](#authenticate-example-using-promises)
    - [Authenticate example - success](#authenticate-example-success)
    - [Authenticate example - failure](#authenticate-example-failure)
  - [Sign](#sign)
    - [Sign parameters](#sign-parameters)
    - [Sign returns](#sign-returns)
    - [Sign example - using async-await](#sign-example-using-async-await)
    - [Sign example - using promises](#sign-example-using-promises)
    - [Sign example - success](#sign-example-success)
    - [Sign example - failure](#sign-example-failure)
- [Known errors](#known-errors)
    - [Error codes](#error-codes)
      - [Timeout errors](#timeout-errors)
      - [Health errors](#health-errors)
      - [Security errors](#security-errors)
      - [Third party errors](#third-party-errors)
      - [Developer mistakes](#developer-mistakes)
- [Development](#development)
  - [Testing changes locally](#testing-changes-locally)
    - [Using `npm link`](#using-npm-link)
    - [Using `npm pack`](#using-npm-pack)

<!-- /code_chunk_output -->


## Install

### Without a module system

Use the **dist/iife** build. It exposes `webeid` object globally.
```html
<script src="web-eid.min.js"></script>
<script>
  // Library registered globally
  webeid.authenticate(...).then(...).catch(...);
</script>
```


### ES module for server-side build tools

When using a server-side build tool like WebPack, Babel, Rollup or the
TypeScript compiler:

1. Run the following command to install the library using NPM:

       echo '@web-eid:registry=https://gitlab.com/api/v4/packages/npm' >> .npmrc
       npm install @web-eid/web-eid-library

2. Import modules without an extension:

```javascript
// Import the Web-eID library
import * as webeid from 'web-eid.js';

// ...or only what you need
import {
  status,
  authenticate,
  Action,
  ErrorCode,
  hasVersionProperties
} from 'web-eid';


// If you need TypeScript interfaces, they are also available!
import AuthenticateOptions from 'web-eid/models/AuthenticateOptions';
```

### ES module for browsers

1. Configure the web server to expose `node_modules/web-eid/dist/es/web-eid.js`
2. Import the modules and specify the file extension

```javascript
// Import the Web-eID library
import * as webeid from 'web-eid.js';
```

### UMD module for AMD and browser-side CommonJS module loaders
Use the **dist/umd** build.

**CommonJS**
```javascript
var webeid = require("web-eid");
```

**AMD**
```javascript
define(["web-eid"], function(webeid) {
  ...
});
```


## API

### Status
```ts
status(options?: RequestOptions): Promise<Versions>
```

To verify that the user has a valid extension and native application version, a status check can be performed.
We recommend checking the status before performing other actions - if status check fails, other actions will most likely fail as well.  
However the choice is yours and you may perform the status check retroactively when an action (for example [authenticate](#authenticate)) fails.

#### Status parameters

| Name              | Type     | Default | Description                             |
|-------------------|----------|---------|-----------------------------------------|
| `options`         | `object` |         | Optional status request options object  |
| `options.timeout` | `number` | `2000`  | Timeout for the request in milliseconds |

#### Status returns

```ts
Promise<Version>
```
```typescript
Version {
  // SemVer string in the format x.y.z
  library: string;

  // SemVer string in the format x.y.z
  nativeApp: string;

  // SemVer string in the format x.y.z
  extension: string;
}
```

#### Status example - check using async-await

```js
try {
  const status = await webeid.status();

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Status example - check using promises

```js
webeid.status()
.then((status) => { /* HANDLE SUCCESS */ })
.catch((error) => { /* HANDLE FAILURE */ });
```

#### Status example - success

The result of a status check is the status object which contains SemVer strings for the library, browser extension and native application.

```js
{
  library:   "1.2.3",
  nativeApp: "1.2.3",
  extension: "1.2.3"
}
```

#### Status example - failure

When the status check fails, in addition to the usual `name`, `message` and `stack` properties, the error object contains additional info **when possible**.  
See [Known errors](#known-errors) for error `code` options.

```javascript
{
  // Name of the Error object
  "name": "VersionMismatchError",

  // Human readable message, meant for the developer
  "message": "Update required for Web-eID extension and native app",

  // Programmatic error code, meant for error handling
  "code": "ERR_WEBEID_VERSION_MISMATCH",

  // SemVer strings of the library, always present
  "library":   "1.2.3",

  // Missing if extension is not installed
  "extension": "0.2.3",

  // Missing if extension or native application is not installed
  "nativeApp": "0.2.3",

  // List of components which require an update
  // Only present if the error is ERR_WEBEID_VERSION_MISMATCH
  "requiresUpdate": {
    "extension": true,
    "nativeApp": true
  },

  // Stack trace
  "stack": ...
}
```


### Authenticate

```ts
authenticate(options: AuthenticateOptions): Promise<HttpResponse>
```
Requests the Web-eID browser extension to authenticate the user.

#### Authenticate parameters

| Name                             | Type     | Default  | Description                                           |
|----------------------------------|----------|----------|-------------------------------------------------------|
| `options`                        | `object` |          | **Required** authentication request options object    |
| `options.getAuthChallengeUrl`    | `string` |          | **Required** authentication challenge GET request URL |
| `options.postAuthTokenUrl`       | `string` |          | **Required** authentication token POST request URL    |
| `options.headers`                | `object` | `{ }`    | **Optional** HTTP request headers                     |
| `options.userInteractionTimeout` | `number` | `120000` | **Optional** user interaction timeout in milliseconds |
| `options.serverRequestTimeout`   | `number` | `20000`  | **Optional** server request timeout in milliseconds   |
| `options.lang`                   | `string` |          | **Optional** ISO 639-1 two-letter language code       |

**`AuthenticateOptions.getAuthChallengeUrl`**
This URL should respond to a GET request with a cryptographic nonce.  
The request will be made by the browser extension.  
The extension will use this nonce to generate an authentication token.

**`AuthenticateOptions.postAuthTokenUrl`**
This URL should accept a JSON payload via a POST request which contains
the authentication token generated by the browser extension.

After the server validates the token,
the server should respond with a 2xx status code and an optional JSON payload.

If the provided token was invalid or the user should be forbidden access
for a different reason, the server should respond with an appropriate
HTTP error status code and an optional JSON payload.

When this request succeeds or fails, the response, including the optional payload, will be part of the resolution or failure of the Promise which the `authenticate(...)` method returns.

**`AuthenticateOptions.headers`**  
This optional field may contain additional HTTP headers which the browser extension will use while making the **auth challenge** and **auth token** requests.  
For example, this option can be used to specify authorization headers.

**`AuthenticateOptions.lang`**  
An optional ISO 639-1 two-letter language code to specify the Web-eID native application's user interface language.  
When the website allows users to specify their preferred website language,
this option may be used to display the Web-eID native application's dialogs in the same language as the user preferred website's language.

#### Authenticate returns

```ts
Promise<HttpResponse> // HTTP response of the auth token POST request
```
```typescript
interface HttpResponse {
  // The HTTP request's response headers.
  headers: Iterable<[string, string]>;

  // A boolean indicating whether the response
  ok: boolean;

  // Indicates whether or not the response is the result of a redirect.
  redirected: boolean;

  // The status code of the response. (This will be 200 for a success).
  status: number;

  // The status message corresponding to the status code. (e.g., OK for 200).
  statusText: string;

  // The type of the response (e.g., basic, cors).
  type: string;

  // The URL of the response.
  url: string;

  // Response body. Can be an object deserialized from JSON or plain text.
  body: object | string;
}
```

#### Authenticate example - using async-await

```js
try {
  const options = {
    getAuthChallengeUrl: "/auth-challenge",
    postAuthTokenUrl:    "/auth-token",
  };

  const response = await webeid.authenticate(options);

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Authenticate example - using promises

```js
const options = {
  getAuthChallengeUrl: "/auth/challenge",
  postAuthTokenUrl:    "/auth/token",
};

webeid.authenticate(options)
.then((status) => { /* HANDLE SUCCESS */ })
.catch((error) => { /* HANDLE FAILURE */ });
```

#### Authenticate example - success

The result of a status check is the status object which contains SemVer strings for the library, browser extension and native application.

```js
{
  // The body content is useful when authenticating in a SPA applications.
  // The server can also send a 204 status with an empty response.
  body: {
    name: {
      first: "John",
      last:  "Smith",
    },
    age: 20,
  },

  headers: {
    "connection":     "keep-alive",
    "content-length": "49",
    "content-type":   "application/json; charset=utf-8",
    "date":           "Mon, 27 Apr 2020 06:28:54 GMT",
    "etag":           "W/\"30-YHV2nUGU912eoDvI+roJ2Yqn5SA\"",
    "x-powered-by":   "Express"
  }

  ok:         true,
  redirected: false,
  status:     200,
  statusText: "OK",
  type:       "basic",

  // The server may chooses to redirect the request on the
  // postAuthTokenUrl address. In case of one or more redirects
  // the URL will be set to the last URL which finally gave an OK status.
  url: "https://example.com/auth/token",
}
```

#### Authenticate example - failure

When the authenticate request fails, in addition to the usual `name`, `message` and `stack` properties, the error object contains additional info **when possible**.  
See [Known errors](#known-errors) for error `code` options.

```js
{
  // Name of the Error object
  name: "ServerRejectedError",

  // Human readable message, meant for the developer
  message: "server rejected the request",

  // Programmatic error code, meant for error handling
  code: "ERR_WEBEID_SERVER_REJECTED",

  // The response object only exists when the server responded
  // with a failure status code.
  response: {
    body: {
      message: "Invalid token",
    },

    headers: {
      "connection":     "keep-alive",
      "content-length": "25",
      "content-type":   "application/json; charset=utf-8",
      "date":           "Mon, 27 Apr 2020 06:28:54 GMT",
      "etag":           "W/\"30-YHV2nUGU912eoDvI+roJ2Yqn5SA\"",
      "x-powered-by":   "Express",
    },

    ok:         false,
    redirected: false,
    status:     401,
    statusText: "Unauthorized",
    type:       "basic",

    url: "https://example.com/auth/token",
  },

  // Stack trace
  "stack": ...
}
```


### Sign

```ts
sign(options: SignOptions): Promise<HttpResponse>
```
Requests the Web-eID browser extension to sign a document hash.

#### Sign parameters

| Name                             | Type     | Default  | Description                                           |
|----------------------------------|----------|----------|-------------------------------------------------------|
| `options`                        | `object` |          | **Required** sign request options object              |
| `options.postPrepareSigningUrl`  | `string` |          | **Required** prepare signing POST request URL         |
| `options.postFinalizeSigningUrl` | `string` |          | **Required** finalize signing POST request URL        |
| `options.headers`                | `object` | `{ }`    | **Optional** HTTP request headers                     |
| `options.userInteractionTimeout` | `number` | `120000` | **Optional** user interaction timeout in milliseconds |
| `options.serverRequestTimeout`   | `number` | `20000`  | **Optional** server request timeout in milliseconds   |
| `options.lang`                   | `string` |          | **Optional** ISO 639-1 two-letter language code       |

**`SignOptions.postPrepareSigningUrl`**
During the signing process, a POST request will be made by the browser extension against the backend service using this URL to initiate preparations for document signing.

The request body will have a JSON payload with `certificate` and `supportedSignatureAlgorithms` field which is provided by the browser extension.

*Example request body:*  
```js
{
  // User's X.509 signing certificate
  certificate: "MIIF2DCCA8CgAwIBAgIQVcAUfV...",

  supportedSignatureAlgorithms: [
    {
      crypto:  "ECC",
      hash:    "SHA-224",
      padding: "NONE"
    },
    {
      crypto:  "ECC",
      hash:    "SHA-256",
      padding: "NONE"
    },
    {
      crypto:  "ECC",
      hash:    "SHA-384",
      padding: "NONE"
    },
    ...
  ]
}
```

Additional information about the request, for example the ID of the document to be signed, can be passed to the server via URL parameters.  
Furthermore, additional request headers, for example authentication and authorization tokens, can be specified using `SignOptions.headers`.

The response must be a JSON object with `hash` and `algorithm` fields.  
Additional fields can be specified in the response, these fields will be passed on to the **finalize document** request by the browser extension.

*Example response body:*  
```js
{
  // Base64-encoded document hash
  hash: "iH7aF+AIAml46AgI2oYGcJzYzbg9JYFKR0oniGAZ7CkT8zVMx9JZtIelHezaOKyP",

  // Hash algorithm from the supportedSignatureAlgorithms array
  algorithm: "SHA-384",

  // Optional arbitrary data for the finalize request
  documentId: 123,
  expires: "2020-10-20T00:00:00.000+0300"
}
```

**`SignOptions.postFinalizeSigningUrl`**  
The browser extension will use this URL to make a POST request for which the backend service should finalize the signing process.

The request body will have a JSON payload with the `signature` field. In addition, the payload includes the `hash`, `algorithm` and additional arbitrary fields provided by the server during the **prepare signing** request.

*Example request body:*  
```js
{
  // Base64-encoded signature
  signature: "O0vhA3XSflWsE/v0xcdLGPG0mbWHySSPXWJkRni8vklWKhlzWvGuHD98rWZzf31VsuldBlhJo9eflZvmKK/tUuTjiwXw2BLq3E+qv6Vs6nLHJNJs/ki6Lm/s+bwffyrH",
  
  // Base64-encoded document hash from the prepare request's response
  hash: "SHA-384",

  // Hash algorithm from the prepare request's response
  algorithm: "",

  // Optional arbitrary data from the prepare request's response
  documentId: 123,
  expires: "2020-10-20T00:00:00.000+0300"
}
```

When this request succeeds or fails, the response, including the optional payload, will be part of the resolution or failure of the Promise which the `sign(...)` method returns.

**`SignOptions.headers`**  
This optional field may contain additional HTTP headers which the browser extension will use while making the **prepare** and **finalize** requests.  
For example, this option can be used to specify authorization headers.

**`SignOptions.lang`**  
An optional ISO 639-1 two-letter language code to specify the Web-eID native application's user interface language.  
When the website allows users to specify their preferred website language,
this option may be used to display the Web-eID native application's dialogs in the same language as the user preferred website's language.

#### Sign returns

```ts
Promise<HttpResponse> // HTTP response of the finalize signing POST request
```
```typescript
interface HttpResponse {
  // The HTTP request's response headers.
  headers: Iterable<[string, string]>;

  // A boolean indicating whether the response
  ok: boolean;

  // Indicates whether or not the response is the result of a redirect.
  redirected: boolean;

  // The status code of the response. (This will be 200 for a success).
  status: number;

  // The status message corresponding to the status code. (e.g., OK for 200).
  statusText: string;

  // The type of the response (e.g., basic, cors).
  type: string;

  // The URL of the response.
  url: string;

  // Response body. Can be an object deserialized from JSON or plain text.
  body: object | string;
}
```

#### Sign example - using async-await

```js
try {
  const options = {
    postPrepareSigningUrl:  "/document/123/sign/prepare",
    postFinalizeSigningUrl: "/document/123/sign/finalize",
  };

  const response = await webeid.sign(options);

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Sign example - using promises

```js
const options = {
  postPrepareSigningUrl:  "/document/123/sign/prepare",
  postFinalizeSigningUrl: "/document/123/sign/finalize",
};

webeid.sign(options)
.then((status) => { /* HANDLE SUCCESS */ })
.catch((error) => { /* HANDLE FAILURE */ });
```

#### Sign example - success

The result of a status check is the status object which contains SemVer strings for the library, browser extension and native application.

```js
{
  // The body content is useful when signing in a SPA applications.
  // The server can also send a 204 status with an empty response.
  body: {
    documentId: "123"
  },

  headers: {
    "content-length": "20",
    "content-type": "application/json; charset=utf-8",
    "date": "Thu, 10 Sep 2020 18:28:12 GMT",
    "etag": "W/\"14-jy7dMclQhztcZaNKkjCj7ZOnAXw\"",
    "x-firefox-spdy": "h2",
    "x-powered-by": "Express"
  },

  ok:         true,
  redirected: false,
  status:     200,
  statusText: "OK",
  type:       "basic",

  // The server may chooses to redirect the request on the
  // postFinalizeSigningUrl address. In case of one or more redirects
  // the URL will be set to the last URL which finally gave an OK status.
  url: "https://example.com/document/123/sign/finalize"
}
```

#### Sign example - failure

When the signing request fails, in addition to the usual `name`, `message` and `stack` properties, the error object contains additional info **when possible**.  
See [Known errors](#known-errors) for error `code` options.

```js
{
  // Name of the Error object
  name: "ServerRejectedError"

  // Human readable message, meant for the developer
  message: "server rejected the request"

  // Programmatic error code, meant for error handling
  code: "ERR_WEBEID_SERVER_REJECTED"

  // The response object only exists when the server responded
  // with a failure status code.
  response: {
    body: {
      message: "Prepared document hash doesn't match"
    },

    headers: {
      "content-length": "50",
      "content-type": "application/json; charset=utf-8",
      "date": "Thu, 10 Sep 2020 18:34:26 GMT",
      "etag": "W/\"32-irPE0oVZ8Habt+b+xMX5wvxwCkk\"",
      "x-firefox-spdy": "h2",
      "x-powered-by": "Express"
    },

    ok:         false,
    redirected: false,
    status:     400,
    statusText: "Bad Request",
    type:       "basic",

    url: "https://example.com/document/234/sign/finalize"
  }

  // Stack trace
  "stack": ...
}
```

## Known errors

There are several known errors that you can catch for the purpose of displaying more helpful error messages to the user.  
Errors returned by the library should always have a `code` property which contains a programmatic error code.

To avoid typos, you can use the `ErrorCode` enum.

**Example**
```ts
try {
  const response = await webeid.authenticate(options);

  // HANDLE SUCCESS

} catch (error) {
  switch (error.code) {
    case webeid.ErrorCode.ERR_WEBEID_SERVER_REJECTED: {
      // It's possible to check the response status code or body here
      if (error.response?.status === 401) {
        showError(error.response.body.message);

      } else if (error.response?.status === 503)
        showError(
          "Authentication is disabled while we are " +
          "performing routine maintenance, try again in 10 minutes!"
        );

      } else {
        showError(
          "Authentication failed, " +
          "please check your credentials and try again!"
        );

      }
      break;
    }

    case webeid.ErrorCode.ERR_WEBEID_USER_TIMEOUT: {
      showError("Authentication timed out, please try again!");
      break;
    }

    default: {
      showError(
        "An unknown error occurred. " +
        "Please try again and contact support if the problem persists!"
      )
    }
  }
}
```

#### Error codes

##### Timeout errors

- **`ERR_WEBEID_ACTION_TIMEOUT`**
  - **Thrown when:** The browser extension has accepted a task, replying to an action with an acknowledge message, but failed to reply reply with a success or failure message in time.
  - **Likely reason:** Should not happen.
  - **How to resolve:** Report a bug.

- **`ERR_WEBEID_USER_TIMEOUT`**
  - **Thrown when:** User interaction timed out.
  - **Likely reason:** User failed to enter a PIN code. In addition, the user did not cancel PIN entry.
  - **How to resolve:** The user may try again. The user interaction timeout is configurable, see [Authenticate](#authenticate) and [Sign](#sign) for details.

- **`ERR_WEBEID_SERVER_TIMEOUT`**
  - **Thrown when:** Server request timed out.
  - **Likely reason:** Server failed to respond in a given time.
  - **How to resolve:** The server may be busy. The server request timeout is configurable, see [Authenticate](#authenticate) and [Sign](#sign) for details.

##### Health errors

- **`ERR_WEBEID_VERSION_MISMATCH`**
  - **Thrown when:** The browser extension and/or native application versions are not matching.
  - **Likely reason:** Either the browser extension or the native application or both, require an update
  - **How to resolve:** An additional object `requiresUpdate` might be attached to the error object.
    The user can be instructed to update the required component.

    ```js
    try {
      const status = webeid.status();
      ...
    } catch (error) {
      if (error?.code === "ERR_WEBEID_VERSION_MISMATCH") {
        if (error.requiresUpdate?.extension) {
          // Web eID browser extension needs to be updated
        }

        if (error.requiresUpdate?.nativeApp) {
          // Web eID native application needs to be updated
        }
      }
    }
    ```

- **`ERR_WEBEID_VERSION_INVALID`**
  - **Thrown when:** The native application did not provide a valid version string during handshake.
  - **Likely reason:** Should not happen.
  - **How to resolve:** Report a bug.

- **`ERR_WEBEID_EXTENSION_UNAVAILABLE`**
  - **Thrown when:** The browser extension fails during the handshake step and does not respond to an action message with a matching acknowledge message.
  - **Likely reason:** The browser extension is not installed.
  - **How to resolve:** The user can be instructed to install the Web eID browser extension.

- **`ERR_WEBEID_NATIVE_UNAVAILABLE`**
  - **Thrown when:** The native application fails during the handshake step.
  - **Likely reason:** The browser extension is not installed.
  - **How to resolve:** The user can be instructed to install the Web eID native application.

- **`ERR_WEBEID_UNKNOWN_ERROR`**
  - **Thrown when:** An unknown error occurs.
  - **Likely reason:** Should not happen.
  - **How to resolve:** Report a bug.

##### Security errors
- **`ERR_WEBEID_CONTEXT_INSECURE`**
  - **Thrown when:** The library is used from an insecure context.
  - **Likely reason:** See [https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
  - **How to resolve:** Use HTTPS.

- **`ERR_WEBEID_PROTOCOL_INSECURE`**
  - **Thrown when:** A provided URL does not start with `https:`.
  - **Likely reason:** getAuthChallengeUrl or postAuthTokenUrl options are missing a secure protocol.
  - **How to resolve:** Use HTTPS.

- **`ERR_WEBEID_TLS_CONNECTION_BROKEN`**
  - **Thrown when:** There's an issue with the TLS connection.
  - **Likely reason:** The TLS handshake failed (for example, the certificate had expired)
  - **How to resolve:** Check the website certificate.

- **`ERR_WEBEID_TLS_CONNECTION_INSECURE`**
  - **Thrown when:** There's an issue with the TLS connection.
  - **Likely reason:** The connection is not a TLS connection.
  - **How to resolve:** Check the website certificate.

- **`ERR_WEBEID_TLS_CONNECTION_WEAK`**
  - **Thrown when:** There's an issue with the TLS connection.
  - **Likely reason:** The connection is a TLS connection but is considered weak. Most likely the negotiated cipher suite is considered weak.
  - **How to resolve:** Check the website certificate.

- **`ERR_WEBEID_CERTIFICATE_CHANGED`**
  - **Thrown when:** Certificate fingerprint changed between requests during the same operation.
  - **Likely reason:** Either a man-in-the-middle attack attempt or the website changed certificate between requests.
  - **How to resolve:** Log the incident and instruct the user to try again.

- **`ERR_WEBEID_ORIGIN_MISMATCH`**
  - **Thrown when:** Origins of provide URLs mismatch for an operation.
  - **Likely reason:** The URLs provided in `authenticate` or `sign` method options were not using the same origin (protocol, domain and port). Either a developer mistake or an XSS attack attempt.
  - **How to resolve:** Make sure the same origin is used. Log the incident and instruct the user to try again.

##### Third party errors
- **`ERR_WEBEID_SERVER_REJECTED`**
  - **Thrown when:** The server replies, but with an HTTP error status code (400 or greater).
  - **Likely reason:** User not authorized, server rejects document signing or other server error.
  - **How to resolve:** This error should include the `response` object that might provide the necessary details.

    ```js
    try {
      const response = webeid.authenticate(options);
      ...
    } catch (error) {
      if (error?.code === "ERR_WEBEID_SERVER_REJECTED") {
        if (error.response?.status === 401) {
          // Authorization has been refused
        }
      }
    }
    ```

- **`ERR_WEBEID_USER_CANCELLED`**
  - **Thrown when:** User cancelled the current operation.
  - **Likely reason:** User closed the certificate selection, pin entry or similar user interaction dialog.
  - **How to resolve:** Respect the user's wishes.

- **`ERR_WEBEID_NATIVE_FATAL`**
  - **Thrown when:** Native application terminated with a fatal error.
  - **Likely reason:** The native application was in an unrecoverable state. For example, the card reader might have been malfunctioning.
  - **How to resolve:** Log the incident and instruct the user to try again. Inspect the error object's `nativeException` attribute for details.

##### Developer mistakes
- **`ERR_WEBEID_ACTION_PENDING`**
  - **Thrown when:** An action of the same type is already pending.
  - **Likely reason:** The user is allowed to initiate actions multiple times without waiting for their resolution.
  - **How to resolve:** Make sure to disable buttons which trigger actions until the action is resolved.

    ```js
    authenticateButton.disabled = true;

    try {
      const response = await authenticate(options);
      ...
    } catch (error) {
      ...
    } finally {
      authenticateButton.disabled = false;
    }
    ```

- **`ERR_WEBEID_MISSING_PARAMETER`**
  - **Thrown when:** Required parameter was missing.
  - **Likely reason:** While calling a library function, a required parameter was not provided.
  - **How to resolve:** The error message might contain helpful hints on what was missing. Check the documentation.


## Development

**You are welcome to create pull requests for the Web-eID library!**

- Make sure your code editor takes advantage of the `.editorconfig` file.  
  It lets your code editor know what the basic formatting rules for this project should be.  
  See: [https://editorconfig.org](https://editorconfig.org)
- Run `npm install` to install dependencies.
- Run `npm run lint` before making a pull request.
- Run `npm run build` to build compile the project and generate bundles.  
  The build process will run the following commands in sequence.

  | Command | Description |
  |-|-|
  | `npm run clean` | Removes the `./dist` directory. |
  | `npm run compile` | Runs the TypeScript compiler, generates:<br>`./dist/node` |
  | `npm run bundle` | Runs the Rollup bundler, generates:<br>`./dist/es`<br>`./dist/iife`<br>`./dist/umd`|


### Testing changes locally

When you've made changes to the library and wish to test the behavior within another project, there are a couple of ways to do it.


#### Using `npm link`

You can use `npm link` to link the Web-eID library source directory to a another project.

**Example**  
```bash
cd ~/workspace/web-eid-library
npm run build

cd ~/workspace/example-website
npm link ~/workspace/web-eid-library
```

**Pros**  
- This option might be more convenient for active development.
- After making changes to the Web-eID library source and rebuilding the library project, you don't need to reinstall the dependency in your other project.

**Cons**  
- ES modules are located at `web-eid/dist/node/` instead of directly under `web-eid/`.
  ```ts
  import AuthenticateOptions from 'web-eid/dist/node/models/AuthenticateOptions';
  ```

#### Using `npm pack`

You can use `npm pack` to generate a package and install the package archive.

**Example**  
```bash
cd ~/workspace/web-eid-library
npm run build
npm package

cd ~/workspace/example-website
npm install ~/workspace/web-eid-library/web-eid-*.tgz
```

**Pros**  
- Accurately simulates a installing from the NPM repository.
- Shorter import path.
  ```ts
  import AuthenticateOptions from 'web-eid/models/AuthenticateOptions';
  ```

**Cons**  
- After making changes to the library, you need to rebuild the package and reinstall the library as a dependency.
