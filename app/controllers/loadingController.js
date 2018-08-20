const folder = require('../helper/folder');
const others = require('../config/others');

let loadingController =  {
    loading: function(req, res){
        const emptyBaseFolder = folder.checkEmptyBaseFolder(`${others.folderBase}`);
        if (emptyBaseFolder) {
            res.render('layouts/loading');
        }
        else {
            if (req.session.load === true) {
                let currentFile = folder.loadImages(`${others.folderCurrent}`);
                let diffFiles = folder.loadImages(`${others.folderDiff}`);
                if (currentFile.length !== 0 && currentFile.length === diffFiles.length) {
                    folder.removeFilesByType(others.folderDiff, 'similar');
                    req.session.load = false;
                    res.redirect('/');
                }   
                else {
                    res.render('layouts/loading');
                }
            }
            else {
                res.redirect('/');
            }
        }
    }
}

module.exports = loadingController;