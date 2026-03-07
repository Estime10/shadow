"use client";

type FormSuccessMessageProps = {
  message: string;
};

export function FormSuccessMessage({ message }: FormSuccessMessageProps) {
  return (
    <p className="text-sm text-accent" role="status">
      {message}
    </p>
  );
}
