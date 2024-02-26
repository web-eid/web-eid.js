# web-eid.js

![European Regional Development Fund](https://github.com/open-eid/DigiDoc4-Client/blob/master/client/images/EL_Regionaalarengu_Fond.png)

`web-eid.js` — add secure authentication and digital signing with electronic ID smart cards to
web applications with the Web eID JavaScript library.
`web-eid.js` is a thin wrapper on top of the messaging interface provided by the
[Web eID browser extension](https://github.com/web-eid/web-eid-webextension).

More information about the Web eID project is available on the project [website](https://web-eid.eu/).

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
    echo @web-eid:registry=https://gitlab.com/api/v4/packages/npm >> .npmrc
    npm install @web-eid/web-eid-library
    ```

2. Configure the web server to expose `node_modules/web-eid/dist/es/web-eid.js`

See below for alternative installation options.

### 2. Activate CSRF protection

To use Web eID securely, CSRF protection must be enabled. Enable and configure CSRF protection in your web application and include the CSRF token in the POST requests as in the code examples below.

### 3. Add authentication support

Use the following code as an example when implementing authentication. For an in-depth description, refer to the [Authenticate](#authenticate) section of the API documentation.

```html
<p>
    <button id="webeid-auth-button">Authenticate</button>
</p>

<script type="module">
    import * as webeid from 'web-eid.js';

    const lang = navigator.language.substr(0, 2);
    const authButton = document.querySelector("#webeid-auth-button");

    authButton.addEventListener("click", async () => {
        try {
            const challengeResponse = await fetch("/auth/challenge", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!challengeResponse.ok) {
                throw new Error("GET /auth/challenge server error: " +
                                challengeResponse.status);
            }
            const {nonce} = await challengeResponse.json();
            
            const authToken = await webeid.authenticate(nonce, {lang});
            
            const authTokenResponse = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeaderName]: csrfToken
                },
                body: JSON.stringify({authToken})
            });
            if (!authTokenResponse.ok) {
                throw new Error("POST /auth/login server error: " +
                                authTokenResponse.status);
            }
            const authTokenResult = await authTokenResponse.json();
            
            console.log("Authentication successful! Result:", authTokenResult);

            window.location.href = "/welcome";

        } catch (error) {
            console.log("Authentication failed! Error:", error);
            throw error;
        }
    });
</script>
```

### 4. Add digital signing support

Copy the following code to the digital signing page of your web application,
customizing CSRF token code, the user language setting and `fetch` URLs according to your application configuration:

```html
<p>
    <button id="webeid-sign-button">Sign document</button>
</p>

<script type="module">
    import * as webeid from 'web-eid.js';

    const lang = navigator.language.substr(0, 2);
    const signButton = document.querySelector("#webeid-sign-button");

    signButton.addEventListener("click", async () => {
        try {
            const {
                certificate,
                supportedSignatureAlgorithms
            } = await webeid.getSigningCertificate({lang});
            
            const prepareSigningResponse = await fetch("/sign/prepare", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeaderName]: csrfToken
                },
                body: JSON.stringify({certificate, supportedSignatureAlgorithms}),
            });
            if (!prepareSigningResponse.ok) {
                throw new Error("POST /sign/prepare server error: " +
                                prepareSigningResponse.status);
            }
            const {
                hash,
                hashFunction
            } = await prepareSigningResponse.json();

            const {
                signature,
                signatureAlgorithm
            } = await webeid.sign(certificate, hash, hashFunction, {lang});
            
            const finalizeSigningResponse = await fetch("/sign/finalize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeaderName]: csrfToken
                },
                body: JSON.stringify({signature, signatureAlgorithm}),
            });
            if (!finalizeSigningResponse.ok) {
                throw new Error("POST /sign/finalize server error: " +
                                finalizeSigningResponse.status);
            }
            const signResult = await finalizeSigningResponse.json();

            console.log("Signing successful! Response:", response);
            // display successful signing message to user

        } catch (error) {
            console.log("Signing failed! Error:", error);
            throw error;
        }
    });
</script>
```

### 5. Test it out

1. Implement the backend.
2. Install Web eID by downloading and running [the Web eID installer](https://web-eid.eu) for your operating system.
3. Make sure that the Web eID browser extension is enabled.
4. Start your web application.
5. Make sure your web application is served over HTTPS, Web eID requires a secure browser context. For local testing, use a tunneling service with HTTPS e.g. [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) or [ngrok](https://ngrok.com/).
6. Open the HTTPS URL in the browser, attach a smart card reader, insert the electronic ID card and try out authentication and signing.


## Table of contents

- [Quickstart](#quickstart)
- [Installation](#installation)
    - [Without a module system](#without-a-module-system)
    - [ES module for build tools](#es-module-for-build-tools)
    - [ES module for browsers](#es-module-for-browsers)
    - [UMD module for AMD and browser\-side CommonJS module loaders](#umd-module-for-amd-and-browser-side-commonjs-module-loaders)
- [CSRF protection](#csrf-protection)
- [API](#api)
  - [Common](#common)
    - [ActionOptions](#actionoptions)
    - [Errors](#errors)
  - [Status](#status)
    - [Status returns](#status-returns)
    - [Status example: using async\-await](#status-example-using-async-await)
    - [Status example: success](#status-example-success)
    - [Status example: failure](#status-example-failure)
  - [Authenticate](#authenticate)
    - [Authenticate parameters](#authenticate-parameters)
    - [Authenticate result](#authenticate-result)
    - [Authenticate example: using async\-await](#authenticate-example-using-async-await)
    - [Authenticate example: result](#authenticate-example-result)
  - [Get signing certificate](#get-signing-certificate)
    - [Get signing certificate parameters](#get-signing-certificate-parameters)
    - [Get signing certificate result](#get-signing-certificate-result)
    - [Get signing certificate example: using async\-await](#get-signing-certificate-example-using-async-await)
    - [Get signing certificate example: result](#get-signing-certificate-example-result)
  - [Sign](#sign)
    - [Sign parameters](#sign-parameters)
    - [Sign returns](#sign-returns)
    - [Sign example: using async\-await](#sign-example-using-async-await)
    - [Sign example: result](#sign-example-result)
- [Upgrading from version 1 to version 2](#upgrading-from-version-1-to-version-2)
- [Known errors](#known-errors)
    - [Error codes](#error-codes)
      - [Timeout errors](#timeout-errors)
      - [Health errors](#health-errors)
      - [Security errors](#security-errors)
      - [Third party errors](#third-party-errors)
      - [Developer mistakes](#developer-mistakes)
- [Development](#development)
  - [Testing changes locally](#testing-changes-locally)
    - [Using npm link](#using-npm-link)
    - [Using npm pack](#using-npm-pack)


## Installation

A stable pre-built version of the library can be downloaded from the [latest release assets](https://github.com/web-eid/web-eid.js/releases).

### Without a module system

Use the **dist/iife** build. It exposes the `webeid` object globally.
```html
<script src="web-eid.min.js"></script>
<script>
  // Library registered globally
  webeid.authenticate(...).then(...).catch(...);
</script>
```

### ES module for build tools

When using a build tool like WebPack, Babel, Rollup or the TypeScript compiler:

1. Run the following command to install the library using NPM:

   ```bash
   echo @web-eid:registry=https://gitlab.com/api/v4/packages/npm >> .npmrc
   npm install @web-eid/web-eid-library
   ```

2. Import the module:

```javascript
// Import the Web-eID library
import * as webeid from '@web-eid/web-eid-library/web-eid';

// ...or only what you need
import {
  status,
  authenticate,
  Action,
  ErrorCode
} from '@web-eid/web-eid-library/web-eid';


// If you need TypeScript interfaces, they are also available!
import ActionOptions from '@web-eid/web-eid-library/models/ActionOptions';
```

### ES module for browsers

1. Configure the web server to expose `node_modules/web-eid/dist/es/web-eid.js`
2. Import the module:

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

## CSRF protection

To use Web eID securely, CSRF protection must be enabled in the web application back end and the CSRF token must be included in all POST requests. The CSRF token is commonly passed to the back end in a request header using the `headers` parameter of `fetch()`.

## API

### Common

#### `ActionOptions`

Object that configures the common options of the `authenticate`, `getSigningCertificate` and `sign` actions.

| Name                             | Type     | Default  | Description                                                  |
| -------------------------------- | -------- | -------- | ------------------------------------------------------------ |
| `options.userInteractionTimeout` | `number` | `120000` | **Optional** user interaction timeout in milliseconds        |
| `options.lang`                   | `string` |          | **Optional** ISO 639-1 two-letter language code to specify the Web-eID native application's user interface language |

When the website allows users to specify their preferred website language,
the `lang` option may be used to display the Web eID native application's dialogs in the same language as the user's preferred website language.

#### Errors

When the status check fails, in addition to the usual `name`, `message` and `stack` properties, the error object contains the additional error code field `code`. See [Known errors](#known-errors) below for error `code` options.



### Status

```ts
status(): Promise<LibraryStatusResponse>
```

To verify that the user has a valid extension and native application version, a status check can be performed.  
Version check is performed automatically by the extension when the [authenticate](#authenticate), [get-signing-certificate](#get-signing-certificate) or [sign](#sign) actions fail.

#### Status returns

```ts
Promise<LibraryStatusResponse>
```
```typescript
LibraryStatusResponse {
  // SemVer string in the format x.y.z
  library: string;

  // SemVer string in the format x.y.z
  extension: string;

  // SemVer string in the format x.y.z
  nativeApp: string;
}
```

#### Status example: using async-await

```js
try {
  const status = await webeid.status();

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Status example: success

The result of a status check is the status object which contains SemVer strings for the library, browser extension and native application.

```js
{
  library:   "1.2.3",
  nativeApp: "1.2.3",
  extension: "1.2.3"
}
```

#### Status example: failure

When the status check fails, **when possible**, in addition to the usual error object properties `name`, `message` and `stack`, the error object contains additional info about the library, extension and native application versions and if the extension or native application require an update.

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
authenticate(challengeNonce: string, options?: ActionOptions): Promise<LibraryAuthenticateResponse>
```
Requests the Web-eID browser extension to authenticate the user. The `challengeNonce` must be recently retrieved from the back end. The result contains the Web eID authentication token that must be sent to the back end for validation.

#### Authenticate parameters

| Name             | Type     | Description                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| `challengeNonce` | `string` | **Required** challenge nonce received from the back end       |
| `options`        | `object` | **Optional** action options object, see `ActionOptions` above |

**`challengeNonce`** must be a base64-encoded cryptographic nonce, generated by the server, with at least 256 bits of entropy.  
For every authentication attempt, the `challengeNonce` must be unique and time-limited.

#### Authenticate result

```ts
Promise<LibraryAuthenticateResponse> // contains the Web eID authentication token
```
```typescript
interface LibraryAuthenticateResponse {
  /**
   * The base64-encoded DER-encoded authentication certificate of the eID user
   *
   * The public key contained in this certificate should be used to verify the signature.
   * The certificate cannot be trusted as it is received from client side and the client can submit a malicious certificate.
   * To establish trust, it must be verified that the certificate is signed by a trusted certificate authority.
   */
  unverifiedCertificate: string;

  /**
   * The algorithm used to produce the authentication signature
   *
   * The allowed values are the algorithms specified in JWA RFC8 sections 3.3, 3.4 and 3.5
   * @see https://www.ietf.org/rfc/rfc7518.html
   */
  algorithm:
  | "ES256" | "ES384" | "ES512"  // ECDSA
  | "PS256" | "PS384" | "PS512"  // RSASSA-PSS
  | "RS256" | "RS384" | "RS512"; // RSASSA-PKCS1-v1_5,

  /**
   * The base64-encoded signature of the token
   */
  signature: string;

  /**
   * The type identifier and version of the token format separated by a colon character
   *
   * @example "web-eid:1.0"
   */
  format: string;

  /**
   * The URL identifying the name and version of the application that issued the token
   *
   * @example "https://web-eid.eu/web-eid-app/releases/2.0.0+0"
   */
  appVersion: string;
}
```

#### Authenticate example: using async-await

```js
try {
  const challengeResponse = await fetch("/auth/challenge", {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });

  // HANDLE challengeResponse ERRORS

  const {challengeNonce} = await challengeResponse.json();

  const authToken = await webeid.authenticate(challengeNonce, {lang});

  const authTokenResponse = await fetch("/auth/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          [csrfHeaderName]: csrfToken
      },
      body: JSON.stringify({authToken})
  });

  // HANDLE authTokenResponse ERRORS

  const authTokenResult = await authTokenResponse.json();

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Authenticate example: result

The result of the authentication action is the object that contains the Web eID authentication token.

```json
{
  "algorithm": "ES384",
  "appVersion": "https://web-eid.eu/web-eid-app/releases/2.0.0+0",
  "format": "web-eid:1",
  "signature": "tbMTrZD4CKUj6atjNCHZruIeyPFAEJk2htziQ1t08BSTyA5wKKqmNmzsJ7562hWQ6+tJd6nlidHGE5jVVJRKmPtNv3f9gbT2b7RXcD4t5Pjn8eUCBCA4IX99Af32Z5ln",
  "unverifiedCertificate": "MIIEAzCCA2WgAwIBAgIQHWbVWxCkcYxbzz9nBzGrDzAKBggqhkjOPQQDBDBgMQswCQYDVQQGEwJFRTEbMBkGA1UECgwSU0sgSUQgU29sdXRpb25zIEFTMRcwFQYDVQRhDA5OVFJFRS0xMDc0NzAxMzEbMBkGA1UEAwwSVEVTVCBvZiBFU1RFSUQyMDE4MB4XDTE4MTAyMzE1MzM1OVoXDTIzMTAyMjIxNTk1OVowfzELMAkGA1UEBhMCRUUxKjAoBgNVBAMMIUrDlUVPUkcsSkFBSy1LUklTVEpBTiwzODAwMTA4NTcxODEQMA4GA1UEBAwHSsOVRU9SRzEWMBQGA1UEKgwNSkFBSy1LUklTVEpBTjEaMBgGA1UEBRMRUE5PRUUtMzgwMDEwODU3MTgwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAAQ/u+9IncarVpgrACN6aRgUiT9lWC9H7llnxoEXe8xoCI982Md8YuJsVfRdeG5jwVfXe0N6KkHLFRARspst8qnACULkqFNat/Kj+XRwJ2UANeJ3Gl5XBr+tnLNuDf/UiR6jggHDMIIBvzAJBgNVHRMEAjAAMA4GA1UdDwEB/wQEAwIDiDBHBgNVHSAEQDA+MDIGCysGAQQBg5EhAQIBMCMwIQYIKwYBBQUHAgEWFWh0dHBzOi8vd3d3LnNrLmVlL0NQUzAIBgYEAI96AQIwHwYDVR0RBBgwFoEUMzgwMDEwODU3MThAZWVzdGkuZWUwHQYDVR0OBBYEFOTddHnA9rJtbLwhBNyn0xZTQGCMMGEGCCsGAQUFBwEDBFUwUzBRBgYEAI5GAQUwRzBFFj9odHRwczovL3NrLmVlL2VuL3JlcG9zaXRvcnkvY29uZGl0aW9ucy1mb3ItdXNlLW9mLWNlcnRpZmljYXRlcy8TAkVOMCAGA1UdJQEB/wQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDAfBgNVHSMEGDAWgBTAhJkpxE6fOwI09pnhClYACCk+ezBzBggrBgEFBQcBAQRnMGUwLAYIKwYBBQUHMAGGIGh0dHA6Ly9haWEuZGVtby5zay5lZS9lc3RlaWQyMDE4MDUGCCsGAQUFBzAChilodHRwOi8vYy5zay5lZS9UZXN0X29mX0VTVEVJRDIwMTguZGVyLmNydDAKBggqhkjOPQQDBAOBiwAwgYcCQgHYElkX4vn821JR41akI/lpexCnJFUf4GiOMbTfzAxpZma333R8LNrmI4zbzDp03hvMTzH49g1jcbGnaCcbboS8DAJBObenUp++L5VqldHwKAps61nM4V+TiLqD0jILnTzl+pV+LexNL3uGzUfvvDNLHnF9t6ygi8+Bsjsu3iHHyM1haKM="
}
```



### Get signing certificate

```ts
getSigningCertificate(options?: ActionOptions): Promise<LibraryGetSigningCertificateResponse>
```

Requests the Web-eID browser extension to retrieve the signing certificate of the user. The certificate must be sent to the back end for preparing the digital signature container and passed to `sign()` as the first parameter.

#### Get signing certificate parameters

| Name      | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| `options` | `object` | **Optional** action options object, see `ActionOptions` above |

#### Get signing certificate result

```ts
Promise<LibraryGetSigningCertificateResponse>
```

```typescript
interface LibraryGetSigningCertificateResponse {
   // The Base64-encoded DER-encoded signing certificate of the eID user
  certificate: string;

   // The supported signature algorithm options
  supportedSignatureAlgorithms: Array<SignatureAlgorithm>;
}
```

```typescript
interface SignatureAlgorithm {
  hashFunction: SignatureHashFunction; // enum of strings
  paddingScheme: SignaturePaddingScheme; // enum of strings
  cryptoAlgorithm: SignatureCryptoAlgorithm; // enum of strings
}
```

#### Get signing certificate example: using async-await

```js
try {
  const {
      certificate,
      supportedSignatureAlgorithms
  } = await webeid.getSigningCertificate({lang});

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Get signing certificate example: result

```json
{
  "certificate":"MIID7DCCA02gAwIBAgIQOZYpcFbeurZbzz9ngqCZsTAKBggqhkjOPQQDBDBgMQswCQYDVQQGEwJFRTEbMBkGA1UECgwSU0sgSUQgU29sdXRpb25zIEFTMRcwFQYDVQRhDA5OVFJFRS0xMDc0NzAxMzEbMBkGA1UEAwwSVEVTVCBvZiBFU1RFSUQyMDE4MB4XDTE4MTAyMzE1MzM1OVoXDTIzMTAyMjIxNTk1OVowfzELMAkGA1UEBhMCRUUxKjAoBgNVBAMMIUrDlUVPUkcsSkFBSy1LUklTVEpBTiwzODAwMTA4NTcxODEQMA4GA1UEBAwHSsOVRU9SRzEWMBQGA1UEKgwNSkFBSy1LUklTVEpBTjEaMBgGA1UEBRMRUE5PRUUtMzgwMDEwODU3MTgwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAASKvaAJSGYBrLcvq0KjgM1sOAS9vbtqeSS2OkqyY4i5AazaetYmCtXKOqUUeljOJUGBUzljDFlAEPHs5Fn+vFT7+cGkOVCA93PBYKVsA9avcWyMwgQQJoW6kA4ZN9yD/mijggGrMIIBpzAJBgNVHRMEAjAAMA4GA1UdDwEB/wQEAwIGQDBIBgNVHSAEQTA/MDIGCysGAQQBg5EhAQIBMCMwIQYIKwYBBQUHAgEWFWh0dHBzOi8vd3d3LnNrLmVlL0NQUzAJBgcEAIvsQAECMB0GA1UdDgQWBBRYwsjA5GJ7HWPvD8ByThPTZ6j3PDCBigYIKwYBBQUHAQMEfjB8MAgGBgQAjkYBATAIBgYEAI5GAQQwEwYGBACORgEGMAkGBwQAjkYBBgEwUQYGBACORgEFMEcwRRY/aHR0cHM6Ly9zay5lZS9lbi9yZXBvc2l0b3J5L2NvbmRpdGlvbnMtZm9yLXVzZS1vZi1jZXJ0aWZpY2F0ZXMvEwJFTjAfBgNVHSMEGDAWgBTAhJkpxE6fOwI09pnhClYACCk+ezBzBggrBgEFBQcBAQRnMGUwLAYIKwYBBQUHMAGGIGh0dHA6Ly9haWEuZGVtby5zay5lZS9lc3RlaWQyMDE4MDUGCCsGAQUFBzAChilodHRwOi8vYy5zay5lZS9UZXN0X29mX0VTVEVJRDIwMTguZGVyLmNydDAKBggqhkjOPQQDBAOBjAAwgYgCQgDBTN1LM08SeH18xKQplqAmV8AQhVvrOxRELCmYp54Qr0XTi2i7kMw0k8gVOV84RlPQP6/ayjs4+ytRbIdkBZK1vQJCARF17/gWYUu7bmy/AXT6fWgyuDV5j2UC2cWDFhPUYyS99rdLGSfP10rP9mPK87Y+4HkfJB/qDyENnJYPa5mUsuFK",
  "supportedSignatureAlgorithms":[
    {
      "cryptoAlgorithm":"ECC",
      "hashFunction":"SHA-224",
      "paddingScheme":"NONE"
    },
    {
      "cryptoAlgorithm":"ECC",
      "hashFunction":"SHA-256",
      "paddingScheme":"NONE"
    },
    {
      "cryptoAlgorithm":"ECC",
      "hashFunction":"SHA-384",
      "paddingScheme":"NONE"
    },
    {
      "cryptoAlgorithm":"ECC",
      "hashFunction":"SHA-512",
      "paddingScheme":"NONE"
    }
  ]
}
```



### Sign

```ts
sign(certificate: string, hash: string, hashFunction: string, options?: ActionOptions): Promise<LibrarySignResponse>
```
Requests the Web-eID browser extension to sign a document hash. The certificate must be retrieved using `getSigningCertificate()` and the hash must be retrieved from the back end.

#### Sign parameters

| Name           | Type     | Description                                                  |
| -------------- | -------- | ------------------------------------------------------------ |
| `certificate`  | `string` | **Required** the base64-encoded signing certificate of the user |
| `hash`         | `string` | **Required** the base64-encoded hash of the data to be signed |
| `hashFunction` | `string` | **Required** the name of the function that was used for computing the hash |
| `options`      | `object` | **Optional** action options object, see `ActionOptions` above |

The allowed `hashFunction` values are SHA-224, SHA-256, SHA-384, SHA-512, SHA3-224, SHA3-256, SHA3-384 and SHA3-512.

#### Sign returns

```ts
Promise<LibrarySignResponse>
```
```typescript
interface LibrarySignResponse {
   // Signature algorithm
  signatureAlgorithm: SignatureAlgorithm;

   // The base64-encoded signature
  signature: string;
}
```

#### Sign example: using async-await

```js
try {
  // certificate, supportedSignatureAlgorithms previously
  // retrieved with getSigningCertificate()
  
  const prepareSigningResponse = await fetch("/sign/prepare", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          [csrfHeaderName]: csrfToken
      },
      body: JSON.stringify({certificate, supportedSignatureAlgorithms}),
  });

  // HANDLE prepareSigningResponse ERRORS

  const {
      hash,
      hashFunction
  } = await prepareSigningResponse.json();

  const {
      signature,
      signatureAlgorithm
  } = await webeid.sign(certificate, hash, hashFunction, {lang});
  
  const finalizeSigningResponse = await fetch("/sign/finalize", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          [csrfHeaderName]: csrfToken
      },
      body: JSON.stringify({signature, signatureAlgorithm}),
  });

  // HANDLE finalizeSigningResponse ERRORS

  const signResult = await finalizeSigningResponse.json();

  // HANDLE SUCCESS

} catch (error) {

  // HANDLE FAILURE

}
```

#### Sign example: result

```json
{
  "signature":"W1r4zf+7LkLs8Dy40nR+UOwZ7pkagywNSUxzB5/RJHdeYUZrmnAjGILdt+ek5vfHLBz9bF7B3UCRZWqZS61uNp2xJvjl7SuxpuAeo0lZrwZlvpuC2lT8mcvz9Eqso391",
  "signatureAlgorithm":{
    "cryptoAlgorithm":"ECC",
    "hashFunction":"SHA-256",
    "paddingScheme":"NONE"
  }
}
```


## Upgrading from version 1 to version 2

In `web-eid.js` API version 1, the `authenticate()` and `sign()` functions took URLs as parameters and the network requests to the website back end were performed inside the extension. This had many benefits, including reduced surface for XSS attacks, additional internal security checks and control over the interaction flow with the user. However, the network requests indirectly caused a Cross-Origin Resource Sharing (CORS) vulnerability in Firefox.

Since version 85 of Chrome (and other Chromium-based browsers), CORS rules are applied to all extension content scripts and access to any other domain *B* from origin domain *A* will be blocked, unless explicitly allowed with the `Access-Control-Allow-Origin` header. However, Firefox currently allows access to any origin without cross-origin restrictions, as the Web eID extension requests loading of the extension on all websites with the `*://*/*` host match pattern. Thus, in Firefox, malicious websites were potentially able to bypass CORS rules and misuse the `headers` parameter and URL parameters of the `authenticate()` and `sign()` network requests to send arbitrary URL parameters and headers to arbitrary websites.

To mitigate the CORS vulnerability in Firefox, the `web-eid.js` API version 2 no longer handles network requests internally; the website developer is expected to perform the requests instead.

To upgrade from API version 1 to version 2,

- in case of authentication, retrieve the challenge nonce from the back end using `fetch()`, pass it as parameter into the `authenticate()` call and send the resulting authentication token to the back end using `fetch()`,
- in case of signing, retrieve the user certificate and supported signature algorithms with the `getSigningCertificate()` call, sent both to the back end using `fetch()` to prepare the digital signature container and retrieve the hash and hash function from the response, pass the hash and hash function as parameters into the `sign()` call and, finally, send the resulting signature and signature algorithm to the back end using `fetch()`.

Also, handle `fetch()` result `Response` errors, assure that CSRF support is enabled and include the CSRF token in all POST requests.

See the code examples above.


## Known errors

There are several known errors that you can catch for the purpose of displaying more helpful error messages to the user.  
Errors returned by the library have a `code` property which contains the programmatic error code.

To avoid typos, you can use the `ErrorCode` enum to refer to the codes.

**Example**
```ts
try {
  const {
      certificate,
      supportedSignatureAlgorithms,
  } = await webeid.getSigningCertificate({lang});

  // HANDLE SUCCESS

} catch (error) {
  switch (error.code) {
    case webeid.ErrorCode.ERR_WEBEID_USER_TIMEOUT: {
      showError("Signing certificate retrieval timed out, please try again!");
      break;
    }

    // other cases

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

##### Third party errors
- **`ERR_WEBEID_USER_CANCELLED`**
  - **Thrown when:** User canceled the current operation.
  - **Likely reason:** User closed the certificate selection, pin entry or similar user interaction dialog.
  - **How to resolve:** Respect the user's wishes.
- **`ERR_WEBEID_NATIVE_INVALID_ARGUMENT`**
  - **Thrown when:** Native application received an invalid argument.
  - **Likely reason:** The web application back end passed an invalid argument to the native application. For example, the challenge nonce was too short.
  - **Unlikely reason:** The extension passed an invalid argument to the native application. For example, an invalid command or command argument.
  - **How to resolve:** Log the incident and make sure that it reaches the backend developers. In case you can verify that the extension is at fault, report an issue in the [extension GitHub issue tracker](https://github.com/web-eid/web-eid-webextension/issues).
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
