import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default language as "en"', () => {
    expect(service.language()).toBe('en');
  });

  it('should have a list of languages', () => {
    expect(service.languages).toEqual({
      "et": "Eesti",
      "en": "English",
      "ru": "Русский",
      "fi": "Suomi",
      "hr": "Hrvatska",
      "de": "Deutsch",
      "fr": "Française",
      "nl": "Nederlands",
      "cs": "Čeština",
      "sk": "Slovenština",
    });
  });

  it('should change the language', () => {
    service.language.set('et');
    expect(service.language()).toBe('et');
  });
});
