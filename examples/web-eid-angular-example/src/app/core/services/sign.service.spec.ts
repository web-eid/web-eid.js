import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SignatureAlgorithm } from '@web-eid/web-eid-library/models/SignatureAlgorithm';

import { SignService } from './sign.service';
import { WebEidService } from './web-eid.service';
import { LanguageService } from './language.service';

describe('SignService', () => {
  let service: SignService;
  let httpMock: HttpTestingController;
  let webEidServiceSpy: jasmine.SpyObj<WebEidService>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;

  beforeEach(() => {
    const webEidSpy = jasmine.createSpyObj('WebEidService', ['getSigningCertificate', 'sign']);
    const languageSpy = jasmine.createSpyObj('LanguageService', ['language']);

    TestBed.configureTestingModule({
      providers: [
        SignService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WebEidService, useValue: webEidSpy },
        { provide: LanguageService, useValue: languageSpy }
      ]
    });

    service = TestBed.inject(SignService);
    httpMock = TestBed.inject(HttpTestingController);
    webEidServiceSpy = TestBed.inject(WebEidService) as jasmine.SpyObj<WebEidService>;
    languageServiceSpy = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign a document', fakeAsync(() => {
    const documentId = '123';
    const lang = 'en';
    const certificate = 'certificate';
    const supportedSignatureAlgorithms: SignatureAlgorithm[] = [
      {
        "cryptoAlgorithm": "ECC",
        "hashFunction": "SHA-256",
        "paddingScheme": "NONE"
      },
      {
        "cryptoAlgorithm": "ECC",
        "hashFunction": "SHA3-512",
        "paddingScheme": "NONE"
      }
    ];

    const hash = 'hash';
    const hashFunction = 'SHA-256';
    const signature = 'signature';
    const finalizeSigningResponse = { success: true };

    languageServiceSpy.language.and.returnValue(lang);
    webEidServiceSpy.getSigningCertificate.and.returnValue(Promise.resolve({ certificate, supportedSignatureAlgorithms }));
    webEidServiceSpy.sign.and.returnValue(Promise.resolve({ signatureAlgorithm: supportedSignatureAlgorithms[0], signature }));

    let result: any;
    service.signDocument(documentId).then(res => result = res);

    tick();
  
    expect(webEidServiceSpy.getSigningCertificate).toHaveBeenCalledWith({ lang });

    const prepareReq = httpMock.expectOne(req =>
      req.method === 'POST' &&
      req.url === '/sign/prepare' &&
      req.params.get('documentId') === documentId
    );
    expect(prepareReq.request.method).toBe('POST');
    prepareReq.flush({ hash, hashFunction });

    tick();

    const finalizeReq = httpMock.expectOne(req =>
      req.method === 'POST' &&
      req.url === '/sign/sign' &&
      req.params.get('documentId') === documentId
    );
    expect(finalizeReq.request.method).toBe('POST');
    finalizeReq.flush(finalizeSigningResponse);

    tick();

    expect(result).toEqual(finalizeSigningResponse);
  }));
});
