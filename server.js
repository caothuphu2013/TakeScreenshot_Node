const express = require('express');
const app = express();

var port = process.env.PORT || (process.argv[2] || 3000);
require('./config/index')(app);

if (!module.parent){
    app.listen(port);
}

module.exports = app; 