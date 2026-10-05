"use client";

import { useId, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Avatar } from "@/components/ui/avatar";
import { countCharacters, POST_MAX_LENGTH } from "@/lib/posts";
import type { User } from "@/lib/types";

/** Show the remaining-characters counter once the user gets this close. */
const COUNTER_THRESHOLD = 20;

type PostComposerProps = {
  viewer: User;
  onSubmit: (content: string) => void;
};

export function PostComposer({ viewer, onSubmit }: PostComposerProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const inputId = useId();
  const counterId = useId();

  const content = text.trim();
  const remaining = POST_MAX_LENGTH - countCharacters(content);
  const isOverLimit = remaining < 0;
  const canSubmit = content.length > 0 && !isOverLimit;
  const showCounter = remaining <= COUNTER_THRESHOLD;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit(content);
    setText("");
    setStatus("Your post was published.");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd + Enter publishes, a common shortcut in social composers.
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex gap-3 border-b border-border px-4 pt-4 pb-3"
    >
      <Avatar user={viewer} />

      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="sr-only">
          Write a post
        </label>
        <textarea
          id={inputId}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setStatus("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={2}
          aria-describedby={showCounter ? counterId : undefined}
          aria-invalid={isOverLimit || undefined}
          className="field-sizing-content block max-h-80 min-h-16 w-full resize-none bg-transparent pt-1.5 text-lg leading-snug placeholder:text-muted focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-3 transition-colors group-focus-within:border-accent/50">
          {showCounter && (
            <span
              id={counterId}
              aria-live="polite"
              className={`text-sm tabular-nums ${isOverLimit ? "font-semibold text-danger" : "text-muted"}`}
            >
              {remaining}
              <span className="sr-only"> characters remaining</span>
            </span>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-accent px-5 py-1.5 text-body font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
          >
            Post
          </button>
        </div>

        <p role="status" className="sr-only">
          {status}
        </p>
      </div>
    </form>
  );
}
