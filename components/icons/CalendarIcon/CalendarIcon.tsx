import { Calendar } from "lucide-react";

type Props = { className?: string };

export function CalendarIcon({ className }: Props) {
  return <Calendar className={className} aria-hidden />;
}
