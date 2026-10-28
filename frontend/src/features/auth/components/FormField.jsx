import { useState } from "react";

const inputBase =
  "block w-full border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-1 focus:ring-gold";

const FormField = ({ label, id, error, type = "text", ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium tracking-wide text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} ${
            error ? "border-red-400" : "border-line focus:border-gold"
          } ${isPassword ? "pr-14" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 cursor-pointer px-4 text-xs text-muted hover:text-ink"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
