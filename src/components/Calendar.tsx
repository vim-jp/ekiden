import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg, EventInput } from "@fullcalendar/core";
import dayjs from "dayjs";
import styled from "@emotion/styled";

type Props = {
  articles: {
    title: string;
    author: string;
    date: string;
    url: string;
  }[];
};

const OverrideCalendarStyle = styled.div`
  .fc-bg-event {
    opacity: 1;
  }
`;

const REGISTRATION_LINK_DISPLAY_DAYS = 30;
function registrationLinkDisplayDates(today: dayjs.Dayjs): string[] {
  const dates = [];
  // 特定の条件を満たす日のみリストに加える
  for (let i = 0; i < REGISTRATION_LINK_DISPLAY_DAYS; i++) {
    const date = today.add(i, "day");
    // 月、水、金
    if ([1, 3, 5].includes(date.get("day"))) {
      dates.push(date.format("YYYY-MM-DD"));
    }
  }
  return dates;
}

const Calendar = (props: Props) => {
  const today = dayjs();
  const eventMap: Map<string, EventInput> = new Map();
  for (const article of props.articles) {
    eventMap.set(article.date, {
      title: article.title,
      url: article.url,
      date: article.date,
      display: "background",
      backgroundColor: "#d0f5dd",

      // extended props
      author: article.author,
      registered: true,
      published: today >= dayjs(article.date),
    });
  }

  for (const date of registrationLinkDisplayDates(today)) {
    if (!eventMap.has(date)) {
      eventMap.set(date, {
        date,
        display: "background",
        backgroundColor: "#f7e3e3",

        // extended props
        registered: false,
      });
    }
  }
  const events = Array.from(eventMap).map(([, v]) => v);

  const eventContent = (arg: EventContentArg) => {
    if (arg.event.extendedProps.registered) {
      return (
        <>
          <div>
            {arg.event.extendedProps.published ? (
              <a href={arg.event.url}>{arg.event.title}</a>
            ) : (
              <span style={{ color: "#111111" }}>{arg.event.title}</span>
            )}
          </div>
          <div>
            <span style={{ color: "#444444" }}>
              {arg.event.extendedProps.author}
            </span>
          </div>
        </>
      );
    } else {
      const title = dayjs(arg.event.start).format("YYYY-MM-DD");
      return (
        <div>
          <div>
            <a
              href={`https://github.com/vim-jp/ekiden/issues/new?template=article.yml&title=${title}`}
            >
              参加登録
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <OverrideCalendarStyle>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        eventContent={eventContent}
      />
    </OverrideCalendarStyle>
  );
};

export default Calendar;
