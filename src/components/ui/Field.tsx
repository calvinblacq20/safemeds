"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const CONTROL = cn(
  "w-full rounded-2xl bg-surface-muted text-ink placeholder:text-ink-faint",
  "border border-transparent px-4 text-sm",
  "transition-colors duration-200",
  "hover:border-line focus:border-brand focus:bg-surface",
  "disabled:opacity-60 disabled:cursor-not-allowed",
);

interface WrapperProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string }) => ReactNode;
  className?: string;
}

/** Owns the label/hint/error scaffolding so every control in the app wires up
 *  htmlFor + aria-describedby identically. */
function Wrapper({
  label,
  hint,
  error,
  required,
  children,
  className,
}: WrapperProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      {children({ id, describedBy })}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type Shared = { label: string; hint?: string; error?: string; wrapperClassName?: string };

export function TextField({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  trailing,
  ...props
}: Shared &
  InputHTMLAttributes<HTMLInputElement> & {
    /** Control rendered inside the field's right edge, e.g. a show/hide toggle. */
    trailing?: ReactNode;
  }) {
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      {({ id, describedBy }) => (
        <div className="relative">
          <input
            {...props}
            id={id}
            required={required}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={cn(
              CONTROL,
              "h-12",
              Boolean(trailing) && "pr-20",
              error && "border-danger",
              className,
            )}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {trailing}
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  rows = 4,
  ...props
}: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      {({ id, describedBy }) => (
        <textarea
          {...props}
          id={id}
          rows={rows}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(CONTROL, "py-3 resize-y", error && "border-danger", className)}
        />
      )}
    </Wrapper>
  );
}

export function SelectField({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  children,
  ...props
}: Shared & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      {({ id, describedBy }) => (
        <select
          {...props}
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(CONTROL, "h-12 cursor-pointer", error && "border-danger", className)}
        >
          {children}
        </select>
      )}
    </Wrapper>
  );
}
