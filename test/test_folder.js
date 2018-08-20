const assert = require('assert');
const folder = require('../app/helper/folder');
const config = require('./config');
const fs = require('fs-extra');

describe('Folder', function () {
    describe('Create Folder Empty', function () {
       	before(done => {
            if (fs.pathExistsSync(`${config.testFolderEmpty}`))
                fs.removeSync(`${config.testFolderEmpty}`);
            done();
        })
        after(done => {
            fs.removeSync(`${config.testFolderEmpty}`);
            done();
        })

        it('should return false when create no success', function () {
            assert.equal(folder.createFolder(`${config.testFolderCurrent}`), false);
        })
        it('should return true when create success', function () {
            assert.equal(folder.createFolder(`${config.testFolderEmpty}`), true);
        })
    })

    describe('Check Empty Folder Which Has Child Folder', function () {
        before(done => {
            let folderBase = './test/images/base_temp';
            folder.createFolder(`${config.testFolderEmpty}`);
            folder.createFolder(folderBase);
            folder.createFolder(`${folderBase}/test`);
            done();
        })

        after(done => {
            let folderBase = './test/images/base_temp';
            fs.removeSync((`${config.testFolderEmpty}`));
            fs.removeSync(folderBase);
            done();
        })

        it('should return true when folder has not child folder', function () {
            assert.equal(folder.checkEmptyBaseFolder(`${config.testFolderEmpty}`), true);
        })

        it('should return true when folder has child folder and not child files', function () {
            let folderBase = './test/images/base_temp';
            assert.equal(folder.checkEmptyBaseFolder(folderBase), true);
        })

        it('should return false when folder has child folder and child files', function () {
            let folderBase = './test/images/base_temp';
            fs.writeFileSync(`${folderBase}/test/test.png`, 'This is a test image');
            assert.equal(folder.checkEmptyBaseFolder(folderBase), false);
        })
    })

    describe('Check Empty Another Folder', function () {
        before(done => {
            folder.createFolder(`${config.testFolderEmpty}`);
            done();
        })

        after(done => {
            fs.removeSync(`${config.testFolderEmpty}`);
            done();
        })

        it('should return false when folder has not files', function () {
            assert.equal(folder.checkEmptyFolder(`${config.testFolderCurrent}`), false);
        })
        it('should return true when folder has files', function () {
            assert.equal(folder.checkEmptyFolder(`${config.testFolderEmpty}`), true);
        })
    })

    describe('Load Images In The Folder', function () {
        it('should return array when load images success', function () {
            assert.notEqual(folder.loadImages(`${config.testFolderCurrent}`).length, 0);
        })
    })

    describe('Remove Type Files In Folder Which Has Files', function () {
        it('should return true when remove success', function () {
            assert.equal(folder.removeFilesByType(`${config.testFolderDiff}`, 'similar'), true);
        })
    })

    describe('Remove First File In Folder Which Has Child Folders', function () {
        it('should return true when remove success', function () {
            let baseFolder = folder.loadImages(`${config.testFolderBase}/test`);
            lengthOld = baseFolder.length;
            assert.notEqual(lengthOld, 0);
            folder.removeFirstFile(baseFolder, `${config.testFolderBase}/test`);
            lengthNew = folder.loadImages(`${config.testFolderBase}/test`).length;
            assert.equal(lengthOld, lengthNew + 1);
        })
    })


    describe('Remove Base Files By Name Array', function () {
        it('should return true when remove success', function () {
            assert.equal(folder.removeBaseFilesByArray(`${config.testFolderBase}`, ['diff_test_0.png']), true);
        })
    })


    describe('Remove Files By Name Array', function () {
        it('should return true when remove success', function () {
            assert.equal(folder.removeFilesByArray(`${config.testFolderDiff}`, ['diff_test_0.png']), true);
        })
    })

    describe('Remove All File In Folder Which Has Files', function () {
        it('should return true when remove success', function () {
            assert.equal(folder.removeAllFile(`${config.testFolderCurrent}`), true);
        })
    })

    describe('Remove All File In Folder Which Has Child Folders', function () {
        it('should return true when remove success', function () {
            folder.removeFileBase(`${config.testFolderBase}`);
            let checkEmptyBaseFolder = folder.checkEmptyBaseFolder(`${config.testFolderBase}`);
            assert.equal(checkEmptyBaseFolder, true);
        })
    })
})