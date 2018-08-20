const path = require('path');
const exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');

module.exports = function(app) {
    app.engine('hbs', exphbs({
        extname: ".hbs",
        layoutsDir: path.resolve("app/views/layouts/"),
        partialsDir: path.resolve("app/views/partials/"),
        helpers: {
            section: express_handlebars_sections()
        }
    }))

    app.set('view engine', 'hbs');
    app.set("views", path.resolve("app/views"));
};