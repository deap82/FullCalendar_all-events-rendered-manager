import "./styles.css";
import { Calendar } from "@fullcalendar/core";
import "@fullcalendar/daygrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { AllEventsRenderedManager } from "./all-events-rendered-manager";

class CalendarView {
  calendar;

  constructor() {
    var allEventsRenderedManager = new AllEventsRenderedManager(
      this.allEventsRendered
    );

    this.calendar = new Calendar(document.getElementById("app"), {
      events: "/events.json",
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        start: "today", // will normally be on the left. if RTL, will be on the right
        center: "title",
        end: "listWeek,timeGridDay,timeGridWeek,dayGridMonth" // will normally be on the right. if RTL, will be on the left
      },
      eventDidMount: (arg) => {
        allEventsRenderedManager.eventDidMount(arg);
        this.eventDidMount(arg);
      }
    });

    this.calendar.render();
  }

  eventDidMount = (arg) => {
    console.log("eventDidMount" /*, arg*/);
  };

  allEventsRendered = (view) => {
    console.log("allEventsRendered", view);
  };
}

new CalendarView();
