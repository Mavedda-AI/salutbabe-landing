export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.salutbabe.com';
const API_VERSION  = process.env.NEXT_PUBLIC_API_BASE_VERSION || 'v1';

/** Root: https://api.salutbabe.com/v1 */
export const API_ROOT = `${API_BASE_URL}/${API_VERSION}`;

/** Build a full API endpoint path, e.g. apiUrl('/auth/social-login') */
export const apiUrl = (path: string) =>
  `${API_ROOT}${path.startsWith('/') ? path : `/${path}`}`;

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const APPLE_CLIENT_ID  = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID  || '';
