const assert = require('assert');
const array = require('../app/helper/array');

describe('Array', function() {
  describe('Get Index Latest With Argument Is Number', function () {
    it('should return -1 when value in array', function () {
      assert.equal(array.getIndexLatest([1, 2, 8, 4], 4), -1);
    });
  
    it('should return get latest of array', function () {
      assert.equal(array.getIndexLatest([10, 9, 15, 10], 3), 3);
    })
  });

  describe('Check All Elements Are Greater Than Value', function() {
    it ('should return true when all elements are greater than value', function() {
      assert.equal(array.checkAllElementsAreGreaterThanValue([10, 9, 15, 10], 3), true);
    });

    it ('should return false when one of elements are less than value', function() {
      assert.equal(array.checkAllElementsAreGreaterThanValue([10, 9, -1, 5], 3), false);
    })
  })
})