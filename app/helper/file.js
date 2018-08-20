let fs = require('fs-extra');
let string = require('../helper/string');
let folder = require('../helper/folder');

function createFile(path, content) {
    if (!fs.pathExistsSync(path)) {
        fs.writeFileSync(path, content);
        return true;
    }
    return false;
}

function addBaseFile(pathFolderBase, pathFolderCurrent, listNames, capacity) {
    let length = listNames.length;
    let nameFile;
    for (let i = 0; i < length; i++) {
        obj = string.splitFileNameAndIndex(listNames[i]);
        nameFile = obj.name;
        index = obj.index;

        folderBase = folder.loadImages(`${pathFolderBase}/${nameFile}`);
        lengthBase = folderBase.length;

        if (lengthBase >= capacity) {
            folder.removeFirstFile(folderBase, `${pathFolderBase}/${nameFile}`);
            fs.createReadStream(`${pathFolderCurrent}/current_${nameFile}.png`)
            .pipe(fs.createWriteStream(`${pathFolderBase}/${nameFile}/base_${nameFile}_${+lengthBase - 1}.png`));
        }
        else {
            fs.createReadStream(`${pathFolderCurrent}/current_${nameFile}.png`)
                .pipe(fs.createWriteStream(`${pathFolderBase}/${nameFile}/base_${nameFile}_${+lengthBase}.png`));
        }
    }
    return true;
}

function replaceBaseFile(pathFolderBase, pathFolderCurrent, listNames) {

    let length = listNames.length;
    for (let i = 0; i < length; i++) {
        obj = string.splitFileNameAndIndex(listNames[i]);
        nameFile = obj.name;
        fs.createReadStream(`${pathFolderCurrent}/current_${nameFile}.png`)
            .pipe(fs.createWriteStream(`${pathFolderBase}/${nameFile}/base_${nameFile}_0.png`));

        //console.log(`Replace base image: base_${nameFile}_0.png`);
    }
    return true;
}

function getArrayIndexImages(currentImages, diffImages) {
    var listIndexs = [];
    let nameCurrent, nameDiff;

    let lengthCurrent = currentImages.length;
    let lengthDiff = diffImages.length;
    for (let i = 0; i < lengthCurrent; i++) {
        nameCurrent = string.splitFileName(currentImages[i]);
        for (let j = 0; j < lengthDiff; j++) {
            nameDiff = string.splitFileNameAndIndex(diffImages[j]).name;
            if (nameDiff.includes(nameCurrent)) {
                listIndexs.push(i);
                break;
            }
        }
    }
    return listIndexs;
}

function removeFile(path) {
    fs.unlinkSync(path);
    return true;
}

/*
function readFileAndSplit(path) {
    let data = fs.readFileSync(path, {encoding: 'utf8'});
    //console.log(data.toString().split('/,/\r\n'));
    let array = data.toString().split('\n');
    let output = [];
    let length = array.length;
    for (let i = 0;i < length - 1;i++) {
        output.push(...array[i].split(','));
    }
    return output;
}
*/

module.exports = {
    createFile,
    getArrayIndexImages,
    addBaseFile,
    replaceBaseFile,
    removeFile,
    //readFileAndSplit
}