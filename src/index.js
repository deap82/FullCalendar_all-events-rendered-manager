import "./styles.css";
import { Calendar } from "@fullcalendar/core";
import "@fullcalendar/daygrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import _ from "lodash";

export class AllEventsRenderedManager {
  _callback;
  _debounceTimeout;
  _debounceTimer;

  _eventsMountedCount = 0;

  /**
   * @param callback The callback to invoke when all events has been rendered.
   * @param debounceTimeout An amount of milliseconds needed to render all events in
   * your FullCalendar implementation. Defaults to 250.
   */
  constructor(callback, debounceTimeout = 250) {
    if (!callback) return;

    this._callback = callback;
    this._debounceTimeout = debounceTimeout;

    this._eventDidMount = _.debounce(
      this.eventDidMountImpl,
      this._debounceTimeout
    );
  }

  _eventDidMount;
  get eventDidMount() {
    return _eventDidMount;
  }

  eventDidMountImpl = (arg) => {
    if (!this._callback) return;

    this._eventsMountedCount++;

    if (this._eventsMountedCount === 1) {
      this._debounceTimer = setTimeout(() => {
        if (this._eventsMountedCount === 1) {
          this._invokeCallback(arg.view);
        }
      }, this._debounceTimeout);
    }

    if (this._eventsMountedCount > 1) {
      this._invokeCallback(arg.view);
    }
  };

  _invokeCallback = (view) => {
    this._debounceTimer && clearTimeout(this._debounceTimer);
    this._debounceTimer = undefined;
    this._eventsMountedCount = 0;
    this._callback(view);
  };
}

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
        end: "listWeek,timeGridDay,timeGridWeek,dayGridMonth", // will normally be on the right. if RTL, will be on the left
      },
      eventDidMount: (arg) => {
        allEventsRenderedManager.eventDidMount(arg);
        this.eventDidMount(arg);
      },
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
