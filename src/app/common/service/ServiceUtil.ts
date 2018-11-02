export class ServiceUtil {
  static wrapPayload<T>(body: T) {
    if (body === null) return null;

    return JSON.stringify({ payload: body });
  }
}
