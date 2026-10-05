/*
 * Small client for the Hopsnop API (the FastAPI backend).
 *
 * Every request to the backend goes through apiRequest(), so the cookie
 * setting, JSON encoding and error handling live in one place.
 *
 * Session: the backend keeps the session in an HttpOnly cookie. The browser
 * stores it and attaches it to requests; this code never sees the token.
 * `credentials: "include"` is what lets the browser send and accept that
 * cookie, because the API is a different origin from the frontend.
 *
 * CSRF: the backend only accepts state-changing requests whose Origin header
 * is the frontend's origin. The browser sets that header itself, so there is
 * no token to attach here. Content-Type is the only request header the
 * backend's CORS policy allows; adding others would make requests fail.
 */

// Next.js inlines NEXT_PUBLIC_ variables at build time, and only when they
// are referenced exactly like this.
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

/** One entry of a 422 response: which part of the request was rejected. */
export type ApiValidationIssue = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

/** Body of every error response from the backend. */
export type ApiErrorResponse = {
  detail: string | ApiValidationIssue[];
};

export type ApiErrorKind =
  /** 422: the request body did not pass validation. */
  | "validation"
  /** 401: no usable session, or wrong credentials. */
  | "unauthenticated"
  /** 403: the request was understood but is not allowed. */
  | "forbidden"
  /** 404: there is no such resource, or it is not available. */
  | "not_found"
  /** 409: the request conflicts with existing data. */
  | "conflict"
  /** Any other 4xx, e.g. an invalid or expired token. */
  | "bad_request"
  /** 5xx, or a response that could not be understood. */
  | "server"
  /** No response at all: offline, API unreachable, or blocked by CORS. */
  | "network";

/**
 * The one error type thrown by apiRequest(). `kind` lets the UI tell a
 * failure the user can fix (validation, credentials) from an unexpected one
 * (server, network) without looking at status codes.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  /** HTTP status, or null when there was no response. */
  readonly status: number | null;
  /** For "validation": the reason each field was rejected, by field name. */
  readonly fieldErrors: Record<string, string>;

  constructor(
    kind: ApiErrorKind,
    status: number | null,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Message for failures the user can only respond to by trying again. */
export function unexpectedErrorMessage(error: unknown): string {
  return isApiError(error) && error.kind === "network"
    ? "Couldn't reach Hopsnop. Check your connection and try again."
    : "Something went wrong. Please try again.";
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
};

/**
 * Calls the API and returns the parsed response body.
 * Throws ApiError for every failure that comes from the request itself.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body }: ApiRequestOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. See .env.example.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // fetch() rejects only when no response arrived.
    throw new ApiError("network", null, "The server could not be reached.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      "server",
      response.status,
      "The server sent an unreadable response.",
    );
  }

  if (!response.ok) {
    throw toApiError(response.status, data);
  }
  return data as T;
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status >= 500) return "server";
  return "bad_request";
}

function toApiError(status: number, body: unknown): ApiError {
  const detail =
    typeof body === "object" && body !== null && "detail" in body
      ? body.detail
      : undefined;

  if (Array.isArray(detail)) {
    return new ApiError(
      kindForStatus(status),
      status,
      "Some fields were rejected.",
      toFieldErrors(detail),
    );
  }
  return new ApiError(
    kindForStatus(status),
    status,
    typeof detail === "string" ? detail : "The request failed.",
  );
}

/** Collects the first message for each rejected field of a 422 response. */
function toFieldErrors(issues: unknown[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    if (typeof issue !== "object" || issue === null) continue;
    const { loc, msg } = issue as Partial<ApiValidationIssue>;
    if (!Array.isArray(loc) || typeof msg !== "string") continue;

    // loc is ["body", "<field>", ...]; errors about the body as a whole
    // have no field and are left out.
    const field = loc[1];
    if (loc[0] !== "body" || typeof field !== "string") continue;

    // Rules written in the backend arrive with this prefix.
    fieldErrors[field] ??= msg.replace(/^Value error, /, "");
  }
  return fieldErrors;
}
