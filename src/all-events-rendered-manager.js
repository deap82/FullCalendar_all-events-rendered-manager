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
  }

  eventDidMount = _.debounce((arg) => {
    if (!this._callback) return;

    this._eventsMountedCount++;

    if (this._eventsMountedCount === 1) {
      this._debounceTimer = setTimeout(() => {
        if (this._eventsMountedCount === 1) {
          this._invokeCallback(arg.view);
        }
      }, this._debounceTimeout);
    }

    if (this.eventsMountedCount > 1) {
      this._invokeCallback(arg.view);
    }
  }, this._debounceTimeout);

  _invokeCallback = (view) => {
    this._debounceTimer && clearTimeout(this._debounceTimer);
    this._debounceTimer = undefined;
    this._eventsMountedCount = 0;
    this._callback(view);
  };
}
