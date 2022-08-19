#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterOpType_service_1 = require("./services/FilterOpType.service");
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var hideBin = require('yargs/helpers').hideBin;
// Clear the CLI before execution starts
clear();
// Print branding - because, why not! :) 
console.log(chalk.green(
// figlet.textSync('Mongo Analyser', { horizontalLayout: 'full' })
));
// Add CLI Options and parse process.argv 
var argv = require('yargs/yargs')(hideBin(process.argv))
    .options('group', {
    alias: 'g', describe: 'Group the output by query formats', type: 'boolean', default: false
})
    .options('limit', {
    alias: 'l', describe: 'Limit the number of output rows', type: 'number', default: 100
})
    .options('log-file', {
    alias: 'f', describe: 'Full Log file path to analyse', demandOption: false, type: 'string'
})
    .options('page-size', {
    alias: 'p', describe: 'Page size of HTML table in report', default: 50, type: 'number'
})
    .options('slow-ms', {
    alias: 's', describe: 'Slow MS Threshold for Query Profiling', default: 100, type: 'number'
})
    .options('uri', {
    alias: 'u', describe: 'Connection string for connection to mongo db', demandOption: false, type: 'string'
})
    .options('db', {
    alias: 'd', describe: 'Database for mongo db', demandOption: false, type: 'string'
})
    .options('ns', {
    alias: 'n', describe: 'Namespace to sort', demandOption: false, type: 'string'
})
    .options('optype', {
    alias: 'o', describe: 'Operation to sort', demandOption: false, type: 'string'
})
    .options('thread', {
    alias: 't', describe: 'Thread to sort', demandOption: false, type: 'string'
})
    .help('help').argv;
console.log(argv);
var filterOpType = new FilterOpType_service_1.FilterOpType(argv.f, argv.n, argv.o, argv.t);
filterOpType.prepareResult();
// logFilePath: string, isGrouped: boolean, limit: number,
// uiPageSize: number, slowMs: number
// switch (argv) {
//     case argv.u:
//             const filterOpType = new FilterOpType(argv.u , argv.db);
//             filterOpType.connectToMongoDB();
//         break;
//     default:
//         break;
// }
// const logStreamer = new LogStreamer(argv.f, argv.g, argv.l, argv.p, argv.s , argv.u);
// logStreamer.stream();
//# sourceMappingURL=index.js.map