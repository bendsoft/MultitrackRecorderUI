import {BackendResponse} from "../types/BackendResponse";

export class ServiceUtil {
  static extractObjectFromResponse<T>(response: BackendResponse<T>): T {
    return response.data
  }

  static wrapPayload<T>(body: T) {
    if (body === null) return null;

    return JSON.stringify({ payload: body });
  }
}
