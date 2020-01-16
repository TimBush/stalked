#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");

const { LocalStorage } = require("./services/LocalStorage");
const localStorage = new LocalStorage();

program.version("1.0.2", "-v, --version").description("Project Time Tracker");

program
  .name(chalk.yellow("stalked"))
  .usage(`${chalk.green("<command>")} ${chalk.blue("[project]")}`);

program
  .command("create <project>")
  .alias("c")
  .description("Create a project")
  .action(project => {
    localStorage.createNewProject(project);
  });

program
  .command("start <project>")
  .alias("s")
  .description("Start tracking a project")
  .action(project => {
    localStorage.startProject(project);
  });

program
  .command("stop <project>")
  .alias("e")
  .description("Stop tracking a project")
  .action(project => {
    localStorage.stopProject(project);
  });

program
  .command("time <project>")
  .alias("t")
  .description("Check the current amount of time you have worked on a project")
  .action(project => {
    localStorage.checkCurrentTime(project);
  });

program
  .command("delete <project>")
  .alias("d")
  .description("Delete a given project")
  .action(project => {
    localStorage.deleteProject(project);
  });

program
  .command("list")
  .alias("l")
  .description("List all project names")
  .action(() => {
    localStorage.showAllProjects();
  });

program.parse(process.argv);
