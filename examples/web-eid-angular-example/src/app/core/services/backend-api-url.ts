declare const WEB_EID_BACKEND_API_URL: string | undefined;

export function backendApiUrl(path: string): string {
  const backendApiUrl = typeof WEB_EID_BACKEND_API_URL === 'string'
    ? WEB_EID_BACKEND_API_URL.trim()
    : '';

  return backendApiUrl
    ? `${backendApiUrl.replace(/\/$/, '')}${path}`
    : path;
}
