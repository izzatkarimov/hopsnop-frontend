import { countCharacters } from "./posts";
import { isHttpUrl } from "./url";

/*
 * Client-side checks for the edit profile form.
 *
 * Like the registration checks, they mirror the backend's rules
 * (app/schemas/user.py) to give quick feedback; the backend validates
 * everything again and has the final say. The display name follows the same
 * rule as at registration (validateDisplayName in auth-validation.ts).
 *
 * Each function returns an error message, or null if the value is acceptable.
 */

export const BIO_MAX_LENGTH = 160;

/** An empty bio is fine: it means "no bio". */
export function validateBio(value: string): string | null {
  if (countCharacters(value.trim()) > BIO_MAX_LENGTH) {
    return `Use at most ${BIO_MAX_LENGTH} characters.`;
  }
  return null;
}

/** An empty value is fine: it means "no picture". */
export function validateAvatarUrl(value: string): string | null {
  const url = value.trim();
  if (url !== "" && !isHttpUrl(url)) {
    return "Enter a full web address that starts with https:// or http://.";
  }
  return null;
}
