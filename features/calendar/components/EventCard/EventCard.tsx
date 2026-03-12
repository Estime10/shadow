import type { CalendarEvent } from "@/features/calendar/types";
import { formatEventDayTime } from "@/features/calendar/utils";

export type EventCardProps = {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
};

export function EventCard({ event, onClick }: EventCardProps) {
  const rootClass = onClick ? "event-card event-card--button md:cursor-pointer" : "event-card";

  const firstLine = (
    <div className="event-card__first-line">
      <time className="event-card__time" dateTime={event.eventDate}>
        {formatEventDayTime(event.eventDate)}
      </time>
      {onClick ? (
        <span className="event-card__title">{event.title}</span>
      ) : (
        <h3 id={`event-title-${event.id}`} className="event-card__title">
          {event.title}
        </h3>
      )}
    </div>
  );

  const descriptionBlock = (
    <div className="event-card__description-block">
      {event.description?.trim() ? (
        <p className="event-card__description-text">{event.description}</p>
      ) : null}
    </div>
  );

  return onClick ? (
    <button
      type="button"
      onClick={() => onClick(event)}
      className={rootClass}
      aria-label={`Voir ${event.title}`}
    >
      {firstLine}
      {descriptionBlock}
    </button>
  ) : (
    <article className={rootClass} aria-labelledby={`event-title-${event.id}`}>
      {firstLine}
      {descriptionBlock}
    </article>
  );
}
