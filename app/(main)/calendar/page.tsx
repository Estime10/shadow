import { SectionWithTitle } from "@/components/layout/SectionWithTitle/SectionWithTitle";
import { CalendarView } from "@/features/calendar/components";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Calendrier",
  description: "Calendrier partagé et événements",
});

export default function CalendarPage() {
  return (
    <SectionWithTitle title="Calendrier">
      <CalendarView />
    </SectionWithTitle>
  );
}
