import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type Props = {
  events: {
    title: string;
    start: string;
  }[];
};

const Calendar = (props: Props) => {
  const events = props.events.map((event) => {
    return {
      ...event,
      ...{ display: "background" },
    };
  });

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale="ja"
      events={events}
    />
  );
};

export default Calendar;
