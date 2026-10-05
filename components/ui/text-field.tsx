import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "className"> & {
  label: string;
  /** Shown below the field while there is no error. */
  hint?: string;
  error?: string | null;
  /** Small control shown next to the label, e.g. "Show" for a password. */
  labelAction?: ReactNode;
};

/** Labelled text input with an optional hint and error message. */
export function TextField({
  label,
  hint,
  error,
  labelAction,
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  const messageId = useId();
  const message = error || hint;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-base placeholder:text-muted aria-invalid:border-danger"
        {...inputProps}
      />
      {message && (
        <p
          id={messageId}
          className={`mt-1 text-sm ${error ? "text-danger" : "text-muted"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
