import { SectionWithTitle } from "@/components/layout/SectionWithTitle/SectionWithTitle";
import { CalendarView } from "@/features/calendar/components";
import { getEventsForCalendar } from "@/features/calendar/data";

import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Calendrier",
  description: "Calendrier partagé et événements",
});

export default async function CalendarPage() {
  const initialEvents = await getEventsForCalendar();
  return (
    <SectionWithTitle title="Calendrier">
      <CalendarView initialEvents={initialEvents} />
    </SectionWithTitle>
  );
}
