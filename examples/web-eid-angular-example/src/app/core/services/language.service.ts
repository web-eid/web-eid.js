import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  language = signal("en");

  readonly languages = {
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
  };
}
