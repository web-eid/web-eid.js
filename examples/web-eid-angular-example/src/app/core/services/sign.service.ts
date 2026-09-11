import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { backendApiUrl } from './backend-api-url';
import { WebEidService } from './web-eid.service';
import { LanguageService } from './language.service';
import { XsrfTokenHeadersService } from './xsrf-token-headers.service';

@Injectable({
  providedIn: 'root'
})
export class SignService {

  headers = { 'Content-Type': 'application/json' };

  constructor(
    private http: HttpClient,
    private webEidService: WebEidService,
    private languageService: LanguageService,
    private xsrfTokenHeadersService: XsrfTokenHeadersService,
  ) { }

  async signDocument(documentId: string): Promise<any> {
    const lang = this.languageService.language();

    const { certificate, supportedSignatureAlgorithms } = await this.webEidService.getSigningCertificate({ lang });

    const prepareSigningResponse = await firstValueFrom(this.http.post<{ hash: string; hashFunction: string }>(
      backendApiUrl('/sign/prepare'),
      { certificate, supportedSignatureAlgorithms },
      {
        headers: this.xsrfTokenHeadersService.addXsrfToken(this.headers),
        params: new HttpParams().set('documentId', documentId),
        withCredentials: true,
      }
    ));

    const { hash, hashFunction } = prepareSigningResponse;

    const { signatureAlgorithm, signature } = await this.webEidService.sign(certificate, hash, hashFunction, { lang });

    const finalizeSigningResponse = await firstValueFrom(this.http.post<any>(
      backendApiUrl('/sign/sign'),
      { signature, signatureAlgorithm },
      {
        headers: this.xsrfTokenHeadersService.addXsrfToken(this.headers),
        params: new HttpParams().set('documentId', documentId),
        withCredentials: true,
      }
    ));

    return finalizeSigningResponse;
  }
}
