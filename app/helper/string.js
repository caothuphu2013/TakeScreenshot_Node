module.exports = {
    splitFileName: function (name){
        var index_underline = name.indexOf('_');
        var index_dot = name.lastIndexOf('.');
        return name.slice(index_underline + 1, index_dot);
    },
    splitFileNameAndIndex: function (name) {
        var index_underline = name.indexOf('_');
        var index_underline_after = name.lastIndexOf('_');
        var index_dot = name.lastIndexOf('.');
        return {
            name: name.slice(index_underline + 1, index_underline_after),
            index: name.slice(index_underline_after + 1, index_dot)
        }
    }
}