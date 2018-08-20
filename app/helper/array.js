module.exports = {
    getIndexLatest: function(array, value) {
        let arr = [];
        let length = array.length;
        for (let i = 0;i < length;i++) {
            if (array[i] > value)
                arr.push(i);
        }

        if (arr.length === length)
            return arr[length - 1];
        return -1;
    }
    ,
    checkAllElementsAreGreaterThanValue(array, value) {
        let length = array.length;
        for (let i = 0;i < length;i++) {
            if (+array[i] < value)
                return false;
        }
        return true;
    }
}