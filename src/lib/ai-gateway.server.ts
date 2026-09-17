const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export type LovableAiGatewayRunIdFetch = {
  fetch: typeof fetch;
  getRunId: () => string | undefined;
};

/**
 * Wraps fetch so the gateway-minted run id is resent on follow-up calls and
 * captured for response headers. Never mint a run id in app code.
 */
export function createLovableAiGatewayRunIdFetch(
  initialRunId?: string,
): LovableAiGatewayRunIdFetch {
  let runId = initialRunId;

  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    const returned = response.headers.get(RUN_ID_HEADER);
    if (returned) runId = returned;
    return response;
  };

  return { fetch: wrapped, getRunId: () => runId };
}

export function getLovableAiGatewayRunId(request: Request): string | undefined {
  return request.headers.get(RUN_ID_HEADER) ?? undefined;
}

export function getLovableAiGatewayResponseHeaders(
  base?: HeadersInit,
  extra?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {};
  new Headers(base).forEach((value, key) => {
    headers[key] = value;
  });
  return { ...headers, ...(extra ?? {}) };
}

export function withLovableAiGatewayRunIdHeader(
  response: Response,
  runIdFetch: LovableAiGatewayRunIdFetch,
): Response {
  const runId = runIdFetch.getRunId();
  if (!runId) return response;
  const headers = new Headers(response.headers);
  headers.set(RUN_ID_HEADER, runId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createLovableResponsesModel(apiKey: string, runIdFetch: LovableAiGatewayRunIdFetch) {
  return { apiKey, fetch: runIdFetch.fetch };
}
