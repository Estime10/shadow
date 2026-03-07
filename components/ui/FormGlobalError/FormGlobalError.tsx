"use client";

type FormGlobalErrorProps = {
  message: string;
};

export function FormGlobalError({ message }: FormGlobalErrorProps) {
  return (
    <p className="text-sm text-(--error)" role="alert">
      {message}
    </p>
  );
}
