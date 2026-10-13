import { ApiError, apiRequest, isApiError } from "./api";
import { isUsername } from "./auth-validation";
import type { Profile, PublicProfile } from "./types";

/*
 * User profile endpoints of the Hopsnop API.
 *
 * The response and request types mirror the backend's schemas
 * (app/schemas/user.py) and use its snake_case field names. The functions
 * return the frontend's Profile type instead, which keeps only what the UI
 * shows.
 */

/** The fields that both views of a user share. */
type ProfileFields = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  /** ISO 8601 timestamp. */
  created_at: string;
};

/** A user as anyone may see them. Returned by GET /users/{username}. */
export type PublicProfileResponse = ProfileFields & {
  /** Whether the caller follows this user. False without a session. */
  following: boolean;
};

/**
 * A user as only they may see themselves. Returned by GET and PATCH
 * /users/me. It adds private account fields to the shared ones.
 */
export type MyProfileResponse = ProfileFields & {
  email: string;
  /** ISO 8601 timestamp. */
  email_verified_at: string | null;
};

/**
 * Body of PATCH /users/me. Only the fields that are present are changed.
 * null clears bio or avatar_url; display_name cannot be cleared. The
 * username and the email address cannot be changed here at all.
 */
export type UpdateProfileRequest = {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
};

/** Returned by POST and DELETE /users/{username}/follow. */
export type FollowResponse = {
  following: boolean;
};

/**
 * Reduces a profile response to what the UI shows. The same function serves
 * the caller's own profile, so the private fields that response carries
 * (email address, verification time) never reach application state.
 */
function toProfile(response: ProfileFields): Profile {
  const {
    id,
    username,
    display_name: displayName,
    avatar_url: avatarUrl,
    bio,
    followers_count: followersCount,
    following_count: followingCount,
  } = response;

  if (
    typeof id !== "string" ||
    typeof username !== "string" ||
    typeof displayName !== "string" ||
    (typeof avatarUrl !== "string" && avatarUrl !== null) ||
    (typeof bio !== "string" && bio !== null) ||
    typeof followersCount !== "number" ||
    typeof followingCount !== "number"
  ) {
    throw new ApiError("server", null, "The server sent an unexpected profile.");
  }

  return {
    id,
    username,
    displayName,
    avatarUrl,
    bio,
    followersCount,
    followingCount,
  };
}

/** The signed-in user's own profile. Requires a session. */
export async function getCurrentProfile(): Promise<Profile> {
  return toProfile(await apiRequest<MyProfileResponse>("/users/me"));
}

/**
 * Changes the signed-in user's own profile and returns the result.
 * The backend rejects an empty set of changes, so callers must send at
 * least one field.
 */
export async function updateCurrentProfile(
  changes: UpdateProfileRequest,
): Promise<Profile> {
  const response = await apiRequest<MyProfileResponse>("/users/me", {
    method: "PATCH",
    body: changes,
  });
  return toProfile(response);
}

/**
 * A user's public profile, or null if there is no such profile to show.
 * Needs no session. The backend gives one answer for every reason a profile
 * is unavailable (unknown, deactivated, never verified), and so does this.
 */
export async function getPublicProfile(
  username: string,
): Promise<PublicProfile | null> {
  // No account can have a name of another shape, so there is nothing to ask.
  // This also keeps a name like "me" from being read as the /users/me path.
  if (!isUsername(username)) return null;

  try {
    const response = await apiRequest<PublicProfileResponse>(
      `/users/${encodeURIComponent(username)}`,
    );
    const profile = toProfile(response);
    if (typeof response.following !== "boolean") {
      throw new ApiError("server", null, "The server sent an unexpected profile.");
    }
    return { ...profile, followedByViewer: response.following };
  } catch (error) {
    if (isApiError(error) && error.kind === "not_found") return null;
    throw error;
  }
}

/**
 * Makes the signed-in user follow the user (true) or no longer follow them
 * (false), and returns whether they follow them afterwards according to the
 * backend. Asking for what is already the case is not an error. Requires a
 * session.
 *
 * The ApiError is "not_found" if there is no such account to follow, and
 * "bad_request" for an attempt to follow oneself.
 */
export async function setFollow(
  username: string,
  following: boolean,
): Promise<boolean> {
  const response = await apiRequest<FollowResponse>(
    `/users/${encodeURIComponent(username)}/follow`,
    { method: following ? "POST" : "DELETE" },
  );
  if (typeof response?.following !== "boolean") {
    throw new ApiError("server", null, "The server sent an unexpected answer.");
  }
  return response.following;
}
