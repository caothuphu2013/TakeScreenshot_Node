const config = require('./config');
const fs = require('fs-extra');
const automation = require('../app/helper/automation');
const folder = require('../app/helper/folder');
describe('Automation', function () {
    before(done => {
        if (fs.pathExistsSync(`${config.testFolder}`)) {
            fs.removeSync(`${config.testFolder}`);
        }
        folder.createFolder(`${config.testFolder}`);
        folder.createFolder(`${config.testFolderBase}`);
        folder.createFolder(`${config.testFolderCurrent}`);
        folder.createFolder(`${config.testFolderDiff}`);
        done();
    })
    describe('Run Automation', function () {
        it('should run when no compare images',  async function () {
            automation.run(`${config.testFolderCurrent}`, `${config.testFolderBase}`)
        })
    })
 
    describe('Compare images', function() {
        before(done => {
            folder.createFolder(`${config.testFolderEmpty}`);
            done();
        })
        
        /*
        after(done => {
            fs.removeSync(`${config.testFolderEmpty}`);
            done();
        })
        */

        it ('should one of two folders empty', function() {
            automation.compareFile(`${config.testFolderEmpty}`, `${config.testFolderBase}`);
        })
    })
})
