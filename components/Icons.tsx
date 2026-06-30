import React from "react";

export function PhoneIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M14.05 5.42a5 5 0 0 1 4.54 4.54" />
      <path d="M14.05 2a8.44 8.44 0 0 1 7.95 7.94" />
      <path d="M22 16.92v2.38a2 2 0 0 1-2.18 2 19.33 19.33 0 0 1-8.42-3 19.06 19.06 0 0 1-5.88-5.88 19.33 19.33 0 0 1-3-8.42A2 2 0 0 1 4.5 1.82h2.38a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.45 2.1l-1 1a15.68 15.68 0 0 0 5.88 5.88l1-1a2 2 0 0 1 2.1-.45 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9H13a8.48 8.48 0 0 1 8 8v.5Z" />
      <path d="M9 10h.01" />
      <path d="M12 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </svg>
  );
}
