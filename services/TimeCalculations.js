const moment = require("moment");
moment.suppressDeprecationWarnings = true;

class TimeCalculations {
  constructor() {}

  /**
   * @param started - This is typically time that the project was startedOn, needs to be a moment()
   * @param ended - This is typically when the project was endedOn, needs to be a moment()
   */
  calculateTimeDifference(started, ended) {
    // Get difference in ms between the end time and start time
    const ms = ended.diff(started);
    // Creates a duration that is equal to the difference in ms
    // This is basically the a snapshot of the duration between the start and end times of this particular session
    return moment.duration(ms);
  }

  /**
   * @param existingTimeDuration - This is typically the total time that the project has been worked on thus far
   * @param currentDuration - This is just the duration of the current session
   */
  renderTotalTime(existingTimeDuration, currentDuration) {
    if (existingTimeDuration === undefined) {
      existingTimeDuration = currentDuration;
    } else {
      existingTimeDuration = moment
        .duration(existingTimeDuration)
        .add(currentDuration);
    }

    return this.createOutputString(existingTimeDuration);
  }

  /**
   * @param currentDuration - This is the duration of the current session only
   */
  renderSessionTime(currentDuration) {
    return this.createOutputString(currentDuration);
  }

  /**
   * @param duration - This is the duration of the current session or total duration
   */
  createOutputString(duration) {
    if (duration.seconds() <= 9) {
      return (
        Math.floor(duration.asHours()) +
        `:${duration.minutes()}:0${duration.seconds()}`
      );
    } else if (duration.minutes() <= 9) {
      return (
        Math.floor(duration.asHours()) +
        `:0${duration.minutes()}:${duration.seconds()}`
      );
    } else {
      return (
        Math.floor(duration.asHours()) +
        `:${duration.minutes()}:${duration.seconds()}`
      );
    }
  }
}

module.exports.TimeCalculations = TimeCalculations;
