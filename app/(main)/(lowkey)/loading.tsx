import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";

export default function LowkeyLoading() {
  return (
    <div
      className="flex min-h-[40vh] flex-1 items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner aria-label="Chargement" />
    </div>
  );
}
