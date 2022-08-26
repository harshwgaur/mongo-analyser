#!/usr/bin/env node

import { LogStreamer } from "./services/LogStreamer.service";
import {ReplicationStateChange} from "./services/ReplicationStateChange.service";
import {RedundantIndex} from "./services/RedundantIndex.service";
import { DistinctMsgCount } from "./services/DistinctMsgCount.service";
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const { hideBin } = require('yargs/helpers');


// Clear the CLI before execution starts
clear();

// Print branding - because, why not! :)
console.log(
    chalk.green(
        // figlet.textSync('Mongo Analyser', { horizontalLayout: 'full' })
    )
);


// Add CLI Options and parse process.argv
const argv = require('yargs/yargs')(hideBin(process.argv))
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
    .options('rs-status-change', {
        alias: 'r', describe: 'Replicaset status over time', default: false, type: 'boolean'
    }).options('redundant-index', {
        alias: 'i', describe: 'Redundant Index Status accross DB', default: false, type: 'boolean'
    }).options('distinct-msg-count', {
        alias: 'dmc', describe: 'Group all the lines for a log file together by the type of message'
    })
    .help('help').argv

// logFilePath: string, isGrouped: boolean, limit: number,
// uiPageSize: number, slowMs: number
// console.log(argv);
if (argv.r) {
    const replicationStateChange = new ReplicationStateChange(argv.f, argv.g, argv.l, argv.p, argv.s);
    replicationStateChange.parse();
} else if (argv.i) {
    const redundantIndex = new RedundantIndex();
    redundantIndex.process().then(() => console.log("successful"));
} else if (argv.f) {
    const logStreamer = new LogStreamer(argv.f, argv.g, argv.l, argv.p, argv.s);
    logStreamer.stream();
} else if (argv.dmc) {
    const distinctMsgCount = new DistinctMsgCount(argv.f);
    distinctMsgCount.stream();
}
