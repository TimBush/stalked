const fs = require('fs')
const path = require('path')

class LocalStorage {

    constructor() {
        this.storageFile = path.join(__dirname + '/storage' + '/localstorage.json')
    }

    createDirectory() {
        const projectsFolder = path.join(__dirname + '/storage')

        fs.mkdir(projectsFolder, (err) => {
            if (err) throw err;
            console.info(chalk.green('Local storage created'))

            const data = JSON.stringify([])
            fs.writeFile(this.storageFile, data, (err) => {
                if (err) throw err;
                console.info('The stuff has been appended')
                process.exit()
            })
            
        })
    }

    readStorageFile(dataToBeAdded) {

        fs.readFile(this.storageFile, (err, data) => {
            if (err) throw err;

            const parsedFile = JSON.parse(data)
            
            this.writeStorageFile(parsedFile, dataToBeAdded);
        })    
    }

    writeStorageFile(data, dataToBeAdded) {
        data.push(dataToBeAdded)

        const newData = JSON.stringify(data);
        
       fs.writeFile(this.storageFile, newData, (err) => {
           if (err) throw err;
           console.info(`Success, project saved`)
       })
    }

    // The purpose of this function is to call readFile & writeFile, to store new data
    // based on what has been passed in to storeNewData
    storeNewData(project) {
        this.readStorageFile(project)
        
    }

}



module.exports.LocalStorage = new LocalStorage()