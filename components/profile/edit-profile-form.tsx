"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Notice } from "@/components/ui/notice";
import { TextAreaField, TextField } from "@/components/ui/text-field";
import { isApiError, unexpectedErrorMessage } from "@/lib/api";
import { validateDisplayName } from "@/lib/auth-validation";
import { countCharacters } from "@/lib/posts";
import {
  BIO_MAX_LENGTH,
  validateAvatarUrl,
  validateBio,
} from "@/lib/profile-validation";
import { updateCurrentProfile } from "@/lib/profiles";
import type { UpdateProfileRequest } from "@/lib/profiles";
import type { Profile } from "@/lib/types";

/** The text fields, in the order they appear. */
const TEXT_FIELDS = ["displayName", "bio", "avatarUrl"] as const;

type TextFieldName = (typeof TEXT_FIELDS)[number];
type Values = Record<TextFieldName, string> & { isPrivate: boolean };
type FieldErrors = Partial<Record<TextFieldName, string>>;

/** Field names in the backend's validation errors, mapped to this form's. */
const API_FIELDS: Record<string, TextFieldName> = {
  display_name: "displayName",
  bio: "bio",
  avatar_url: "avatarUrl",
};

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  const results: Record<TextFieldName, string | null> = {
    displayName: validateDisplayName(values.displayName),
    bio: validateBio(values.bio),
    avatarUrl: validateAvatarUrl(values.avatarUrl),
  };
  for (const field of TEXT_FIELDS) {
    const error = results[field];
    if (error) errors[field] = error;
  }
  return errors;
}

/**
 * The fields whose value differs from the saved profile, and only those:
 * PATCH /users/me changes exactly what it is sent. An emptied bio or avatar
 * URL is sent as null, which clears it.
 */
function changesFrom(profile: Profile, values: Values): UpdateProfileRequest {
  const changes: UpdateProfileRequest = {};
  const displayName = values.displayName.trim();
  const bio = values.bio.trim() || null;
  const avatarUrl = values.avatarUrl.trim() || null;

  if (displayName !== profile.displayName) changes.display_name = displayName;
  if (bio !== profile.bio) changes.bio = bio;
  if (avatarUrl !== profile.avatarUrl) changes.avatar_url = avatarUrl;
  if (values.isPrivate !== profile.isPrivate) {
    changes.is_private = values.isPrivate;
  }
  return changes;
}

function fieldErrorsFrom(error: unknown): FieldErrors {
  const errors: FieldErrors = {};
  if (isApiError(error) && error.kind === "validation") {
    for (const [apiField, message] of Object.entries(error.fieldErrors)) {
      const field = API_FIELDS[apiField];
      if (field) errors[field] = message;
    }
  }
  return errors;
}

/** Moves focus to the first field with an error. False if there is none. */
function focusFirstInvalid(form: HTMLFormElement, errors: FieldErrors): boolean {
  const field = TEXT_FIELDS.find((name) => errors[name]);
  if (!field) return false;

  const control = form.elements.namedItem(field);
  if (control instanceof HTMLElement) control.focus();
  return true;
}

type EditProfileFormProps = {
  profile: Profile;
  /** Called with the profile as the backend saved it. */
  onSaved: (profile: Profile) => void;
  onCancel: () => void;
};

/**
 * Edits the signed-in user's own profile. The username and the email address
 * are not here: the backend does not allow either to be changed.
 */
export function EditProfileForm({
  profile,
  onSaved,
  onCancel,
}: EditProfileFormProps) {
  const { expireSession } = useAuth();
  const [values, setValues] = useState<Values>({
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    isPrivate: profile.isPrivate,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Guards against sending the same change twice. A ref, because it changes
  // at once: `submitting` only changes when React next renders, which can be
  // after a second submit event has already arrived.
  const inFlight = useRef(false);

  const hasChanges = Object.keys(changesFrom(profile, values)).length > 0;

  function textProps(field: TextFieldName) {
    return {
      name: field,
      value: values[field],
      error: errors[field],
      onChange: (event: { target: { value: string } }) => {
        setValues((current) => ({ ...current, [field]: event.target.value }));
        // The message no longer describes what is in the field.
        setErrors((current) => ({ ...current, [field]: undefined }));
      },
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    // Kept in a variable: event.currentTarget is cleared after an await.
    const form = event.currentTarget;
    const found = validate(values);
    setErrors(found);
    setFormError(null);
    if (focusFirstInvalid(form, found)) return;

    const changes = changesFrom(profile, values);
    if (Object.keys(changes).length === 0) {
      // Nothing to save, and the backend rejects an empty update.
      onCancel();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      onSaved(await updateCurrentProfile(changes));
    } catch (error) {
      if (isApiError(error) && error.kind === "unauthenticated") {
        // The session ended while editing. RequireAuth leads to the login page.
        expireSession();
        return;
      }
      const rejected = fieldErrorsFrom(error);
      setErrors(rejected);
      if (!focusFirstInvalid(form, rejected)) {
        setFormError(
          isApiError(error) && error.kind === "validation"
            ? "Some details were not accepted. Check them and try again."
            : unexpectedErrorMessage(error),
        );
      }
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      method="post"
      noValidate
      onSubmit={handleSubmit}
      aria-label="Edit profile"
      className="flex flex-col gap-4 border-b border-border px-4 py-4"
    >
      <h2 className="text-lg font-semibold">Edit profile</h2>

      {formError && <Notice tone="error">{formError}</Notice>}

      <TextField
        label="Display name"
        autoComplete="name"
        autoFocus
        required
        {...textProps("displayName")}
      />
      <TextAreaField
        label="Bio"
        rows={3}
        hint={`${countCharacters(values.bio.trim())} / ${BIO_MAX_LENGTH}`}
        {...textProps("bio")}
      />
      <TextField
        label="Avatar URL"
        type="url"
        inputMode="url"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="https://"
        hint="A link to an image. Leave empty to use your initials."
        {...textProps("avatarUrl")}
      />

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="isPrivate"
          checked={values.isPrivate}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isPrivate: event.target.checked,
            }))
          }
          className="mt-0.5 size-4 shrink-0 accent-accent"
        />
        <span>
          <span className="block text-sm font-medium">Private account</span>
          <span className="block text-sm text-muted">
            Marks your account as private. Your profile itself stays visible
            to everyone.
          </span>
        </span>
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-full border border-border px-5 py-1.5 text-body font-semibold transition-colors hover:bg-hover disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !hasChanges}
          className="rounded-full bg-accent px-5 py-1.5 text-body font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
