const index = require('../app/controllers/index');
const errorPage = require("../app/controllers/errorController");

const folder = require('../app/helper/folder');
const others = require('../app/config/others');
const automation = require('../app/helper/automation');

module.exports = function(app) {
    folder.createFolder(`${others.folderImage}`);
    folder.createFolder(`${others.folderBase}`);
    folder.createFolder(`${others.folderCurrent}`);
    folder.createFolder(`${others.folderDiff}`);

    app.get('/', index.home.loadImages);
    app.get('/loading', index.loading.loading);
    app.post('/replace', index.home.replaceImages);
    app.post('/add/base', index.home.addBaseLine)
    app.post('/automate', index.home.automate);
    app.post('/reset', index.home.reset);
    app.use(errorPage);
}