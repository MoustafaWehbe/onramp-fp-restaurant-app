export function unwrapResponse<T>(response: unknown): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  ) {
    return (response as { data: T }).data;
  }

  return response as T;
}