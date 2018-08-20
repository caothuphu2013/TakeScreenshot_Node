const fs = require('fs');
const string = require('../helper/string');
const { imgDiff } = require('img-diff-js');

module.exports = {
    createFolder: function (dir){
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            return true;
        }
        return false;
    },
    checkEmptyFolder: function (path){
        let files = fs.readdirSync(path);
        let length = files.length;
        if (length === 0)
            return true;
        return false;
    },
    checkEmptyBaseFolder: function (path){
        let folders = fs.readdirSync(path);
        let lengthFolder = folders.length;
        if (lengthFolder === 0)
            return true;
        else {
            for (let i = 0;i < lengthFolder;i++) {
                files = fs.readdirSync(`${path}/${folders[i]}`);
                if (files.length === 0) 
                    return true;
            }
            return false;
        }
    },
    loadImages: function (path) {
        let arr = [];
        fs.readdirSync(path).forEach(file => {
            arr.push(file);
        })
        return arr;
    },
    removeAllFile: function (path){
        let listImages = this.loadImages(path);
        let length = listImages.length;
        if (length) {
            for (let i = 0;i < length;i++) {
                fs.unlinkSync(`${path}/${listImages[i]}`);
            }
            return true;
        }
        return false;
    },
    removeFileBase: function(path) {
        let listImages = this.loadImages(path);
        let length = listImages.length;
        for (let i = 0;i < length;i++) {
            this.removeAllFile(`${path}/${listImages[i]}`)
        }
    },
    removeFilesByType: function (path, type) {
        let files = fs.readdirSync(path);
        let length = files.length;
        for (let i = 0;i < length;i++) {
            if (files[i].includes(type)) {
                fs.unlinkSync(`${path}/${files[i]}`);
            }
        }
        return true;
    },
    removeFilesByArray: function(path, array) {
        let length = array.length;
        for (let i = 0;i < length;i++) {
            fs.unlinkSync(`${path}/${array[i]}`);
        }
        return true;
    },
    removeBaseFilesByArray: function(path, array) {
        let length = array.length;
        let nameFile;
        for (let i = 0;i < length;i++) {
            nameFile = string.splitFileNameAndIndex(array[i]).name;
            this.removeAllFile(`${path}/${nameFile}`);
        }
        return true;
    },
    getIndexBaseImages: function(pathFolderBase, pathFolderCurrent, nameFolderBase, nameFileCurrent) {
        let promises = [];
        let files = fs.readdirSync(`${pathFolderBase}/${nameFolderBase}`);
        let length = files.length;

        for (let i = 0;i < length;i++) {
            promises.push(imgDiff({
                actualFilename: `${pathFolderBase}/${nameFolderBase}/${files[i]}`,
                expectedFilename: `${pathFolderCurrent}/${nameFileCurrent}`
            }).then( result => {
                if (result.imagesAreSame == true) 
                    return -1;
                return result.diffCount;
            }));
        }
        return promises;  
    },
    removeFirstFile: function(folderBase, path) {
        let length = folderBase.length;
        let nameOld, nameNew;
        for (let i = 1;i < length;i++) {
            nameOld = `${path}/${folderBase[i]}`;
            nameNew = `${path}/${folderBase[i - 1]}`;
            fs.renameSync(nameOld, nameNew);
        }       
    }
}
