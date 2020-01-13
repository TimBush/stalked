const path = require("path");
const chalk = require("chalk");
const moment = require("moment");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const { TimeCalculations } = require("./TimeCalculations");
const actions = new TimeCalculations();

// Denotes where the localstorage is
const adapter = new FileSync(
  path.join(__dirname, "../storage", "/localstorage.json")
);
const db = low(adapter);

/**
 * This is the interface for interacting with the DB/local storage
 * Standard Create, Write, Update, and Delete actions are included
 */
class LocalStorage {
  constructor() {
    this.storageFile = path.join(__dirname, "../storage", "/localstorage.json");
  }

  /**
   * Starts a given project & updates the DB
   * @param {string} projectName The name of the project to be started
   */
  startProject(projectName) {
    const project = this.doesProjectExist(projectName);
    if (!project) return;

    if (project.isActive)
      return this.printErrors(project, { alreadyStarted: true });

    // Find the project
    const foundProject = db
      .get("projects")
      .find({ projectName })
      .assign({
        startedOn: moment().format("MM/DD/YYYY HH:mm:ss"),
        isActive: true
      })
      .write();

    this.printToConsole(foundProject, { started: true });
  }

  /**
   * Handles ending the project, calculating the time differences and rendering the end-user output
   * @param {string} projectName The project that needs to be ended.
   */
  stopProject(projectName) {
    const project = this.doesProjectExist(projectName);
    if (!project) return;

    if (!project.isActive)
      return this.printErrors(project, { notStarted: true });

    // Locate the project to update
    const foundProject = db
      .get("projects")
      .find({ projectName })
      .value();

    const started = moment(foundProject.startedOn, "MM/DD/YYYY HH:mm:ss");
    const ended = moment();

    // Create a string of the current endedOn time to display in a user-friendly way
    const endedOn = moment().format("MM/DD/YYYY HH:mm:ss");

    // We need this to figure out how long the user worked on the project for this given instance
    const duration = actions.calculateTimeDifference(started, ended);

    // Determines the totalTime the user has spent on this project
    const totalTime = actions.renderTotalTime(
      foundProject.totalTimeOnProject,
      duration
    );
    const currentSessionTime = actions.renderSessionTime(duration);

    // Save to DB
    const savedProject = db
      .get("projects")
      .find({ projectName })
      .assign({
        totalTimeOnProject: totalTime,
        currentSessionTime,
        endedOn,
        isActive: false
      })
      .write();

    this.printToConsole(savedProject, { ended: true });
  }

  /**
   * Displays the total amount of time the user has spent on a given project
   * @param {string} projectName The name of the project to check the time for
   */
  checkCurrentTime(projectName) {
    const project = this.doesProjectExist(projectName);
    if (!project) return;

    // If project has not been worked on yet
    if (!project.totalTimeOnProject)
      return this.printErrors(project, { noTimeOnProject: true });

    const foundProject = db
      .get("projects")
      .find({ projectName })
      .value();

    this.printToConsole(foundProject, { checkTime: true });
  }

  /**
   * Deletes a given project from local storage
   * @param {string} projectName The name of the project
   */
  deleteProject(projectName) {
    if (!this.doesProjectExist(projectName)) return;

    db.get("projects")
      .remove({ projectName })
      .write();

    this.printToConsole({ projectName }, { deleted: true });
  }

  /**
   * Lists all of the users project names
   */
  showAllProjects() {
    const names = db
      .get("projects")
      .map("projectName")
      .value();
    for (let name in names) {
      this.printToConsole({ projectName: names[name] }, { listNames: true });
    }
  }

  /**
   * Creates a new project with the projectName and saves it to local storage
   * @param {string} project Name of the project provided by the user on the command line
   */
  createNewProject(project) {
    const newProject = {
      projectName: project,
      createdOn: moment().format("MM/DD/YYYY HH:mm:ss"),
      isActive: false
    };

    db.get("projects")
      .push(newProject)
      .write();

    this.printToConsole(newProject, { created: true });
  }

  /** HELPER FUNCTIONS */

  /**
   * Locates and returns a given project from local storage
   * If no project is found undefined is returned
   * @param {string} projectName The name of the project
   */
  getProject(projectName) {
    return db
      .get("projects")
      .find({ projectName })
      .value();
  }

  /**
   * Determines if the project exists
   * if it does NOT an error is printed, otherwise the project is returned
   * @param {string} projectName The name of the project
   */
  doesProjectExist(projectName) {
    const project = this.getProject(projectName);
    if (!project) {
      this.printErrors({ projectName }, { noProjectFound: true });
      return false;
    }
    return project;
  }

  /**
   * Generates console outputs with general information to display to the user
   * @param {object} project A single project object from local storage
   * @param {object} options Determines the output
   * @param {boolean} options.created Outputs a project created line
   * @param {boolean} options.deleted Outputs a project deleted line
   * @param {boolean} options.checkTime Outputs total time on given project
   * @param {boolean} options.listNames Outputs project name
   * @param {boolean} options.started Outputs a project started line
   * @param {boolean} options.ended Outputs ended information w/ durations
   */
  printToConsole(project, options) {
    // Message declerations
    const totalTime = `You've worked on this project for a total of ${chalk.green(
      project.totalTimeOnProject
    )} (HH:MM:SS).`;

    const endedOn = `${chalk.blue(
      project.projectName
    )} was ended on ${chalk.green(project.endedOn)}`;

    const sessionTime = `You worked on this project for ${chalk.green(
      project.currentSessionTime
    )} (HH:MM:SS) this time around.`;

    const deleted = `${chalk.blue(project.projectName)} has been ${chalk.red(
      "deleted"
    )}`;
    const created = `${chalk.blue(project.projectName)} has been ${chalk.green(
      "created"
    )}`;

    const listNames = `${chalk.blue(project.projectName)}`;

    const started = `${chalk.blue(project.projectName)} has been ${chalk.green(
      "started"
    )}`;

    if (options.checkTime) {
      return console.info(totalTime);
    }

    if (options.deleted) {
      return console.info(deleted);
    }
    if (options.created) {
      return console.info(created);
    }

    if (options.listNames) {
      return console.info(listNames);
    }

    if (options.started) {
      return console.info(started);
    }

    if (options.ended) {
      console.info(endedOn);
      console.info(sessionTime);
      console.info(totalTime);
    }
  }

  /**
   * Generates console outputs for errors
   * @param {object} project The project object
   * @param {object} options Different options to determin the error returned
   * @param {boolean} options.alreadyStarted Outputs project already started
   * @param {boolean} options.notStarted Outputs project not started
   * @param {boolean} options.noProjectFound Outputs project not found
   * @param {boolean} options.noTimeOnProject Outputs that a project hasn't had any time logged on it yet
   */
  printErrors(project, options) {
    const alreadyStarted = `${chalk.yellow("WARN")} - ${chalk.blue(
      project.projectName
    )} is already started`;

    const notStarted = `${chalk.yellow("WARN")} - ${chalk.blue(
      project.projectName
    )} has not been started`;

    const noProjectFound = `${chalk.yellow("WARN")} - ${chalk.blue(
      project.projectName
    )} not found`;

    const noTimeOnProject = `${chalk.yellow(
      "WARN"
    )} - You have not logged any time on ${chalk.blue(
      project.projectName
    )}. If you've started it for the first time, use "stalked stop ${chalk.blue(
      project.projectName
    )}" to get an updated time.`;

    if (options.alreadyStarted) return console.info(alreadyStarted);

    if (options.noProjectFound) return console.info(noProjectFound);

    if (options.notStarted) return console.info(notStarted);

    if (options.noTimeOnProject) return console.info(noTimeOnProject);
  }
}

module.exports.LocalStorage = LocalStorage;
