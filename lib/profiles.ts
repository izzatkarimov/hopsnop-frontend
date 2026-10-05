import { ApiError, apiRequest, isApiError } from "./api";
import { isUsername } from "./auth-validation";
import type { Profile } from "./types";

/*
 * User profile endpoints of the Hopsnop API.
 *
 * The response and request types mirror the backend's schemas
 * (app/schemas/user.py) and use its snake_case field names. The functions
 * return the frontend's Profile type instead, which keeps only what the UI
 * shows.
 */

/** A user as anyone may see them. Returned by GET /users/{username}. */
export type PublicProfileResponse = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_private: boolean;
  followers_count: number;
  following_count: number;
  /** ISO 8601 timestamp. */
  created_at: string;
};

/**
 * A user as only they may see themselves. Returned by GET and PATCH
 * /users/me. It adds private account fields to the public profile.
 */
export type MyProfileResponse = PublicProfileResponse & {
  email: string;
  /** ISO 8601 timestamp. */
  email_verified_at: string | null;
};

/**
 * Body of PATCH /users/me. Only the fields that are present are changed.
 * null clears bio or avatar_url; the other two cannot be cleared. The
 * username and the email address cannot be changed here at all.
 */
export type UpdateProfileRequest = {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_private?: boolean;
};

/**
 * Reduces a profile response to what the UI shows. The same function serves
 * the caller's own profile, so the private fields that response carries
 * (email address, verification time) never reach application state.
 */
function toProfile(response: PublicProfileResponse): Profile {
  const {
    id,
    username,
    display_name: displayName,
    avatar_url: avatarUrl,
    bio,
    is_private: isPrivate,
    followers_count: followersCount,
    following_count: followingCount,
  } = response;

  if (
    typeof id !== "string" ||
    typeof username !== "string" ||
    typeof displayName !== "string" ||
    (typeof avatarUrl !== "string" && avatarUrl !== null) ||
    (typeof bio !== "string" && bio !== null) ||
    typeof isPrivate !== "boolean" ||
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
    isPrivate,
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
export async function getPublicProfile(username: string): Promise<Profile | null> {
  // No account can have a name of another shape, so there is nothing to ask.
  // This also keeps a name like "me" from being read as the /users/me path.
  if (!isUsername(username)) return null;

  try {
    const response = await apiRequest<PublicProfileResponse>(
      `/users/${encodeURIComponent(username)}`,
    );
    return toProfile(response);
  } catch (error) {
    if (isApiError(error) && error.kind === "not_found") return null;
    throw error;
  }
}
