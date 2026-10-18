// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

declare const WEB_EID_BACKEND_API_URL: string | undefined;

const XSRF_COOKIE_NAME = hasConfiguredBackendApiUrl()
  ? 'WEBEID-XSRF-TOKEN'
  : 'XSRF-TOKEN';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withXsrfConfiguration({
      cookieName: XSRF_COOKIE_NAME,
      headerName: 'X-XSRF-TOKEN',
    })),
  ]
};

function hasConfiguredBackendApiUrl() {
  return typeof WEB_EID_BACKEND_API_URL === 'string' && WEB_EID_BACKEND_API_URL.trim().length > 0;
}
