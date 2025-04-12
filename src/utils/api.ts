import * as SecureStore from 'expo-secure-store';

// API base URL - replace with your actual API URL
export const API_URL = 'https://your-api-url.com';

// Helper function to fetch with authorization
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const userJson = await SecureStore.getItemAsync('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies for session-based auth
    headers,
  });

  // If we get a 401 (unauthorized) error, clear the stored user
  if (response.status === 401) {
    await SecureStore.deleteItemAsync('user');
  }

  return response;
}

// API request function with JSON parsing
export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithAuth(endpoint, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  // For DELETE requests, we might not have a response body
  if (method === 'DELETE') {
    return {} as T;
  }

  return await response.json();
}