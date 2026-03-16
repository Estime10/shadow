import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";

export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] flex-1 items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner aria-label="Chargement de la page" />
    </div>
  );
}
