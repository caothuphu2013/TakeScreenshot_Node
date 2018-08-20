const q = require('q');
const others = require('../config/others');
const folder = require('../helper/folder');
const file = require('../helper/file');
const automation = require('../helper/automation');
const string = require('../helper/string');

let homeController = {
    loadImages: function (req, res) {
        const emptyCurrentFolder = folder.checkEmptyFolder(`${others.folderCurrent}`);
        const emptyBaseFolder = folder.checkEmptyBaseFolder(`${others.folderBase}`);
        console.log('Load images');
        if (emptyBaseFolder) {
            res.render('_home/home', {
                layout: "index",
                isImages: false
            })
        }
        else if (emptyCurrentFolder)
            res.redirect('/loading');
        else {
            let baseImages = folder.loadImages(`${others.folderBase}`);
            let diffImages = folder.loadImages(`${others.folderDiff}`);
            let currentImages = folder.loadImages(`${others.folderCurrent}`);
            q.all([baseImages, diffImages, currentImages]).spread((temp1, temp2, temp3) => {
                let listImages = [];
                let listIndexs = file.getArrayIndexImages(temp3, temp2);
                let length = listIndexs.length;
                for (let i = 0; i < length; i++) {
                    obj = string.splitFileNameAndIndex(temp2[i]);
                    listImages.push({
                        baseImage: `${obj.name}/base_${obj.name}_${obj.index}.png`,
                        diffImage: temp2[i],
                        currentImage: temp3[listIndexs[i]]
                    });
                }

                if (length === 0) {
                    isImages = false;
                }
                else {
                    isImages = true;
                }

                res.render('_home/home', {
                    layout: "index",
                    listImages,
                    isImages
                })
            })
        }
    }
    ,
    replaceImages: function (req, res) {
        let listNames = req.body;
        
        folder.removeBaseFilesByArray(others.folderBase, listNames);
        file.replaceBaseFile(others.folderBase, others.folderCurrent, listNames);
        folder.removeFilesByArray(others.folderDiff, listNames);
        res.send({
            message: 'Replace image success!',
            data: listNames
        });
    }
    ,
    addBaseLine: function (req, res) {
        let listNames = req.body;
        file.addBaseFile(others.folderBase, others.folderCurrent, listNames, others.capacity);
        folder.removeFilesByArray(others.folderDiff, listNames);
        res.send({
            message: 'Add base images success!',
            data: listNames
        });
    }
    ,
    automate: function (req, res) {
        const emptyCurrentFolder = folder.checkEmptyFolder(`${others.folderCurrent}`);
        if (emptyCurrentFolder) {
            automation.run(`${others.folderCurrent}`, `${others.folderBase}`);
        }
        else {
            req.session.load = true;
            folder.removeAllFile(`${others.folderCurrent}`);
            folder.removeAllFile(`${others.folderDiff}`);
            automation.reload(`${others.folderCurrent}`, `${others.folderBase}`);   
        }
        res.redirect('/loading');
    }
    ,
    reset: function(req, res) {
        folder.removeFileBase(`${others.folderBase}`);
        folder.removeAllFile(`${others.folderCurrent}`);
        folder.removeAllFile(`${others.folderDiff}`);
        automation.run(`${others.folderCurrent}`, `${others.folderBase}`);
        res.redirect('/loading');
    }
}

module.exports = homeController;