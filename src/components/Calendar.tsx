import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";

type Props = {
  articles: {
    title: string;
    author: string;
    date: string;
    url: string;
  }[];
};

const Calendar = (props: Props) => {
  const events = props.articles.map((article) => {
    return {
      title: article.title,
      url: article.url,
      date: article.date,
      author: article.author,
      display: "background",
    };
  });

  const eventContent = (arg: EventContentArg) => {
    return (
      <div>
        <div>
          <a href={arg.event.url}>{arg.event.title}</a>
        </div>
        <div>{arg.event.extendedProps.author}</div>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale="ja"
      events={events}
      eventContent={eventContent}
    />
  );
};

export default Calendar;
