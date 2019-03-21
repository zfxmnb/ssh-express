#!/usr/bin/env node

var utils = require("../utils");
var Client = require('./fssh').Client;
var configObject = require('./config');
var argv = utils.getArgs();

if (argv[0] === "init") {
    configObject.set();
} else if (argv[0] === '$' && argv.length > 1) {
    argv.splice(0, 1);
    var cmd = argv.join(' ');
    Client(cmd);
}