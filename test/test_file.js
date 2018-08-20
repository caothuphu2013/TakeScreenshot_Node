const assert = require('assert');
const file = require('../app/helper/file');
const config = require('./config');
const fs = require('fs-extra');
const folder = require('../app/helper/folder');

describe('File', function () {
    describe('Create File Test', function () {
        before(done => {
            if (fs.pathExistsSync(`${config.testFolderBase}/test`))
                fs.removeSync(`${config.testFolderBase}/test`);
            done();
        })
        it('should create a file test in base folder', function () {
            folder.createFolder(`${config.testFolderBase}/test`);
            assert.equal(file.createFile(`${config.testFolderBase}/test/base_test_0.png`, 'This is a base test image 0'), true);
            assert.equal(file.createFile(`${config.testFolderBase}/test/base_test_1.png`, 'This is a base test image 1'), true);
            assert.equal(file.createFile(`${config.testFolderBase}/test/base_test_2.png`, 'This is a base test image 2'), true);
        })

        it('should create a file test in current folder', function () {
            assert.equal(file.createFile(`${config.testFolderCurrent}/current_test.png`, 'This is a current test image'), true);
        })

        it('should create a diff file test in diff folder', function () {
            assert.equal(file.createFile(`${config.testFolderDiff}/diff_test_0.png`, 'This is a diff test image'), true);
            assert.equal(file.createFile(`${config.testFolderDiff}/diff_empty_0.png`, 'This is a empty test image'), true);
        })

        it('should create a similar file test in diff folder', function () {
            assert.equal(file.createFile(`${config.testFolderDiff}/similar_test_0.png`, 'This is a similar test image'), true);
        })

        it ('should return false when do not create file', function() {
            assert.equal(file.createFile(`${config.testFolderDiff}/similar_test_0.png`, 'This is a similar test image'), false);
        })
    })

    describe('Get Array Index Images', function () {
        it('should return [] when arguments are same []', function () {
            assert.deepEqual(file.getArrayIndexImages(
                [], []
            ), []);
        });

        it('should return indexs of currentlists', function () {
            assert.deepEqual(file.getArrayIndexImages(
                ['cur_a.png', 'cur_b.png', 'cur_c.png'],
                ['diff_a_1.png', 'diff_b_2.png']
            ), [0, 1]);
        })

        it('should return [] when name 2 images no same', function () {
            assert.deepEqual(file.getArrayIndexImages(
                ['cur_d.png', 'cur_d.png', 'cur_d.png'],
                ['diff_a_2.png', 'diff_b_2.png', 'diff_c_1.png']
            ), []);
        })
    })


    describe('Add Base Image Into Base Folder', function () {
        before(done => {
            folder.createFolder(`${config.testFolderBase}/empty`);
            file.createFile(`${config.testFolderCurrent}/current_empty.png`, 'This is a current empty image');
            file.createFile(`${config.testFolderDiff}/diff_empty_0.png`, 'This is a diff empty image');
            done();
        })

        it('should add success when length less than capacity', function () {
            assert.equal(file.addBaseFile(config.testFolderBase, config.testFolderCurrent, ['diff_empty_0.png'], config.testCapacity), true);
        })

        it('should add success when length more than or equal capacity', function () {
            assert.equal((file.addBaseFile(config.testFolderBase, config.testFolderCurrent, ['diff_test_1.png'], config.testCapacity)), true);
        })
    })

    describe('Replace Base Image', function () {
        it('should return true if replace success', function () {
            assert.equal(file.replaceBaseFile(config.testFolderBase, config.testFolderCurrent, ['diff_test_1.png']), true);
        })
    })

    describe('Remove File', function() {
        it ('should return true if remove file success', function() {
            assert.equal(file.removeFile(`${config.testFolderDiff}/diff_empty_0.png`), true);
        })
    })

})