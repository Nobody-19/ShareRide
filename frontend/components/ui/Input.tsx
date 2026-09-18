"use client";

import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-ink dark:text-white/90">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-xl border bg-card dark:bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 dark:placeholder:text-white/35 dark:text-white",
              "focus:border-primary focus:ring-2 focus:ring-primary/15",
              error ? "border-red-400" : "border-ink/12 dark:border-white/12",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1 text-xs text-ink/45 dark:text-white/45">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-ink dark:text-white/90">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-card dark:bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 dark:placeholder:text-white/35 dark:text-white resize-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/15",
            error ? "border-red-400" : "border-ink/12 dark:border-white/12",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-ink dark:text-white/90">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-card dark:bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors dark:text-white",
            "focus:border-primary focus:ring-2 focus:ring-primary/15",
            error ? "border-red-400" : "border-ink/12 dark:border-white/12",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
