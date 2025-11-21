"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.get('/', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' });
});
app.listen(config_1.config.port, function () {
    console.log('CORS-enabled web server listening on port ', config_1.config.port);
});
//# sourceMappingURL=cors.middleware.js.map