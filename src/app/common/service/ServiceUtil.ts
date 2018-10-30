import {BackendResponse} from "../types/BackendResponse";

export class ServiceUtil {
  static extractObjectFromResponse<T>(response: BackendResponse<T>): T | T[] {
    const data = response.data;
    if (Array.isArray(data)) {
      return data as T[];
    }
    return data as T;
  }

  static wrapPayload<T>(body: T | T[]) {
    if (body === null) return null;

    return JSON.stringify({ payload: body });
  }
}
