import { Injectable } from '@angular/core';

import * as webeid from "@web-eid/web-eid-library";

import ActionOptions from '@web-eid/web-eid-library/models/ActionOptions';
import {
  LibraryAuthenticateResponse,
  LibraryGetSigningCertificateResponse,
  LibrarySignResponse,
  LibraryStatusResponse
} from '@web-eid/web-eid-library/models/message/LibraryResponse';

/**
 * This is a wrapper service for the Web eID library.
 * It makes it easier to mock the library in tests.
 */
@Injectable({
  providedIn: 'root'
})
export class WebEidService {
  async status(): Promise<LibraryStatusResponse> {
    return webeid.status();
  }

  async authenticate(
    challengeNonce: string,
    options?: ActionOptions
  ): Promise<LibraryAuthenticateResponse> {
    return webeid.authenticate(challengeNonce, options);
  }

  async getSigningCertificate(
    options?: ActionOptions
  ): Promise<LibraryGetSigningCertificateResponse> {
    return webeid.getSigningCertificate(options);
  }

  async sign(
    certificate: string,
    hash: string,
    hashFunction: string,
    options?: ActionOptions
  ): Promise<LibrarySignResponse> {
    return webeid.sign(certificate, hash, hashFunction, options);
  }
}
