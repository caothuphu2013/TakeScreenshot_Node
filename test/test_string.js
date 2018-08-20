const assert = require('assert');
const string = require('../app/helper/string');

describe('String', function() {
    describe('Split File Name When It Has Not Index', function() {
        it ('should return length > 0 when split success', function() {
            let name = string.splitFileName('test_split.png');
            assert.notEqual(name.length, 0);
        })
    })

    describe('Split File Name And Index When It Has Index', function() {
        it ('should return two lengths > 0 when split success', function() {
            let object = string.splitFileNameAndIndex('test_split_2.png');
            let name = object.name;
            let index = object.index;
            assert.notEqual(name.length, 0);
            assert.notEqual(index.length, 0);
        })
    })
})