import { MessageCircle } from "lucide-react";

type Props = { className?: string };

export function MessageIcon({ className }: Props) {
  return <MessageCircle className={className} aria-hidden />;
}
