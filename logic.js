const {Project} = require('./models/project')

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const chalk = require('chalk')
const moment = require('moment')
moment.suppressDeprecationWarnings = true;

class ProjectActions {
    constructor() {
    }

    async createProject(projectName) {
        const newProject = await new Project({
            name: projectName
        });  
                    
        const savedProject = await newProject.save();
        console.info(`${chalk.blue(savedProject.name)} created at ${chalk.green(savedProject.createdOn)}`);
        
        // Disconnect from DB, so connection doesn't hang
        mongoose.disconnect()
    }

    async startProject(projectName) {
        const startedProject = await Project.findOneAndUpdate({ name: projectName }, {
            startedOn: moment().format('MM/DD/YYYY HH:mm:ss'),
            isActive: true
        }, { new: true, useFindAndModify: false })

        console.info(`${chalk.blue(startedProject.name)} started at ${chalk.green(startedProject.startedOn)}`)

        mongoose.disconnect();
    }

    async endProject(project) {
        const search = new RegExp(project, 'i')
        // Find the project the user is looking for
        const projectEnded = await Project.findOne({ name: search })
        
        const started = moment(projectEnded.startedOn, 'MM/DD/YYYY HH:mm:ss')
        const ended = moment()

        // Create a string of the current endedOn time to display in a user-friendly way
        const endedOn = moment().format('MM/DD/YYYY HH:mm:ss')

        const duration = this.calculateTimeDifference(started, ended)


        const totalTime = this.renderTotalTime(projectEnded.totalTimeDuration, duration)
        const currentSessionTime = this.renderSessionTime(duration)
        
        projectEnded.totalTimeOnProject = totalTime
        projectEnded.currentSessionTime = currentSessionTime
        projectEnded.endedOn = endedOn
        projectEnded.isActive = false

        const savedProject = await projectEnded.save()
        

        console.info(`${chalk.blue(savedProject.name)} was ended on ${chalk.green(savedProject.endedOn)}`)
        console.info(`You worked on this project for ${chalk.green(savedProject.currentSessionTime)} (HH:MM:SS) this time around`)
        console.info(`You've worked on this project for a total of ${chalk.green(savedProject.totalTimeOnProject)} (HH:MM:SS)`)

        mongoose.disconnect()
    }

    async checkCurrentTime(projectName) {
        const search = new RegExp(projectName, 'i')
        const endedOn = moment()

        const currentProject = await Project.findOne({ name: search })
  
        currentProject.endedOn = endedOn

        // Get the difference in time duration between startedOn and endedOn
        const duration = this.calculateTimeDifference(currentProject.startedOn, endedOn)
        // Calculate the total time on this project over it's entire life
        const totalTime = this.renderTotalTime(currentProject.totalTimeDuration, duration)
        // Calculate the current session time a user has been working on this project
        const sessionTime = this.renderSessionTime(duration)

        console.info(`You have been working on this project for ${chalk.green(sessionTime)}`)
        console.info(`Total time on project: ${chalk.green(totalTime)}`)

        mongoose.disconnect();
    }

    async deleteProject(projectName) {
        const search = new RegExp(projectName, 'i')
        const deletedProject = await Project.findOneAndDelete({ name: search })

        console.info(`You have successfully deleted ${chalk.blue(deletedProject.name)}`)

        mongoose.disconnect()
    }

    async showAllProjects() {
        const allProjects = await Project.find().select('name')
        
        allProjects.forEach(project => {
            console.info(chalk.blue(project.name))
        })
        
        process.exit()
    }


    /* 
    * @param started - This is typically time that the project was startedOn, needs to be a moment()
    * @param ended - This is typically when the project was endedOn, needs to be a moment()
    */
    calculateTimeDifference(started, ended) {
         // Get difference in ms between the end time and start time
         const ms = ended.diff(started)
         // Creates a duration that is equal to the difference in ms
         // This is basically the a snapshot of the duration between the start and end times of this particular session
         return moment.duration(ms)

    }

    /* 
    * @param existingTimeDuration - This is typically the total time that the project has been worked on thus far
    * @param currentDuration - This is just the duration of the current session
    */
    renderTotalTime(existingTimeDuration, currentDuration) {

        if (existingTimeDuration === undefined) {
            existingTimeDuration = currentDuration
        } else {
            existingTimeDuration = moment.duration(existingTimeDuration).add(currentDuration)
        }

        
        return this.createOutputString(existingTimeDuration)
         
    }

    /* 
    * @param currentDuration - This is the duration of the current session only
    */
    renderSessionTime(currentDuration) {
        return this.createOutputString(currentDuration)
    }

    /* 
    * @param duration - This is the duration of the current session or total duration
    */
    createOutputString(duration) {
        if (duration.seconds() < 9) {
            return Math.floor(duration.asHours()) + `:${duration.minutes()}:0${duration.seconds()}`
        } else if (duration.minutes() < 9) {
            return Math.floor(duration.asHours()) + `:0${duration.minutes()}:${duration.seconds()}`
        } else {
            return Math.floor(duration.asHours()) + `:${duration.minutes()}:${duration.seconds()}` 
        }
    }
    
}




module.exports.ProjectActions = ProjectActions;