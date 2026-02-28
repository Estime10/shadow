/**
 * Logger simple avec tag pour filtrer en dev (ex. [message-read], [messages]).
 * En production on peut désactiver ou envoyer vers un service.
 */

const PREFIX = "[shadow]";

export function log(tag: string, message: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const label = `${PREFIX} ${tag}`;
  if (data !== undefined) {
    console.log(label, message, data);
  } else {
    console.log(label, message);
  }
}

export function logError(tag: string, message: string, error?: unknown): void {
  console.error(`${PREFIX} ${tag}`, message, error ?? "");
}
