#!/usr/bin/env node

require('dotenv').config()
const mongoose = require('mongoose')
const program = require('commander')

const {ProjectActions} = require('./logic')
const { LocalStorage } = require('./localstorage')
const {Project} = require('./models/project')

const Actions = new ProjectActions()
//const LocalStorage = new LocalStorage();

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true})

program.version('0.0.1', '-v, --version').description('Time Tracker System')

program.command('create <project>')
        .alias('c')
        .description('Create a project')
        .action(async (project) => {
            await Actions.createProject(project)
        });

program.command('start <project>')
        .alias('s')
        .description('Start tracking a project')
        .action(async (project) => {
            await Actions.startProject(project)
        });

program.command('stop <project>')
        .alias('e')
        .description('Stop tracking a project')
        .action(async (project) => {
            await Actions.endProject(project)
        })

program.command('time <project>')
        .alias('t')
        .description('Check the current amount of time you have worked on a project')
        .action(async (project) => {
            await Actions.checkCurrentTime(project)
        })

program.command('delete <project>')
        .alias('d')
        .description('Delete a given project')
        .action(async (project) => {
            await Actions.deleteProject(project)
        })

program.command('list')
        .alias('l')
        .description('List all projects')
        .action(async () => {
            await Actions.showAllProjects()
        })

program.command('storage')
        .alias('st')
        .description('Create local storage')
        .action(async () => {
            await LocalStorage.readFile()
        })
        

program.parse(process.argv)

