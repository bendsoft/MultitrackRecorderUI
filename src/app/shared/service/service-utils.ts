export class ServiceUtils {
  static wrapPayload<T>(body: T) {
    if (body === null) return null;

    return JSON.stringify({ payload: body });
  }
}
