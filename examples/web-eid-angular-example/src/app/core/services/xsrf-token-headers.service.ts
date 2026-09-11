import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';

const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

@Injectable({
  providedIn: 'root'
})
export class XsrfTokenHeadersService {
  constructor(
    private xsrfTokenExtractor: HttpXsrfTokenExtractor,
  ) { }

  addXsrfToken(headers: Record<string, string>): Record<string, string> {
    const token = this.xsrfTokenExtractor.getToken();

    return token
      ? { ...headers, [XSRF_HEADER_NAME]: token }
      : headers;
  }
}
