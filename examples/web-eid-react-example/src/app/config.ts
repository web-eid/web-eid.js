const backendApiUrl = import.meta.env.VITE_WEB_EID_BACKEND_API_URL?.trim().replace(/\/$/, '') ?? ''

export const config = {
  backendApiUrl,
  languages: [
    { code: 'et', label: 'Eesti' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'fi', label: 'Suomi' },
    { code: 'hr', label: 'Hrvatska' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Française' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'cs', label: 'Čeština' },
    { code: 'sk', label: 'Slovenština' },
  ],
  defaultLanguage: 'en',
}
