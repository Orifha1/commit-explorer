import type { IApiResponse } from '@/lib/types';

/**
 *
 * @param {string} path  The full URL to send the get request.
 * @returns {Promise<IApiResponse>} A response containing:
 *  - success: Whether the request was successful.
 *  - body: The parsed body if available.
 *  - errors: A list of error messages.
 *  - message: A message for success or failure.
 */

export const get = async <T>(path: string): Promise<IApiResponse<T>> => {
  try {
    const result = await fetch(path, {
      method: 'GET',
      redirect: 'error',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    const success = result.ok;
    const contentType = result.headers.get('Content-Type');
    const responseBody = contentType?.includes('application/json') ? await result.json() : {};

    if (success) {
      return {
        success: true,
        body: responseBody,
        message: 'Request successful',
      };
    } else {
      return {
        success: true,
        body: responseBody,
        message: 'Request successful',
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      message: 'Unexpected error',
    };
  }
};
