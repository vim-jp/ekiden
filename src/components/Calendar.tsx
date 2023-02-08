import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type Props = {
  events: {
    title: string;
    start: string;
  }[];
};

const Calendar = (props: Props) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale="ja"
      events={props.events}
    />
  );
};

export default Calendar;
