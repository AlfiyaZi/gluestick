#! /usr/bin/env node

const fs = require("fs");
const process = require("process");
const spawn = require("child_process").spawn;
const newApp = require("./commands/new");
const startClient = require("./commands/start-client");
const startServer = require("./commands/start-server");
const help = require("./commands/help");
const chalk = require("chalk");

const command = process.argv[2];
const isProduction = process.env.NODE_ENV === "production";

console.log(`Capsela Web: ${command}`);

const scripts = {
    new: newApp,
    start: startBoth,
    "start-client": startClient,
    "start-server": startServer,
    help: help
};

const script = scripts[command];

if (!script) {
    console.log(`invalid command "${command}"`);
    help();
    process.exit();
}

function spawnProcess (type) {
    var childProcess;
    switch (type) {
        case "client":
            childProcess = spawn("cweb", ["start-client"], {stdio: "inherit", env: Object.assign({}, process.env)});
            break;
        case "server":
            childProcess = spawn("cweb", ["start-server"], {stdio: "inherit", env: Object.assign({}, process.env, {NODE_ENV: isProduction ? "production": "development-server"})});
    }

    childProcess.on("error", function (data) { console.log(chalk.red(JSON.stringify(arguments))) });
    return childProcess;
}

function startBoth () {
    var client = spawnProcess("client");
    var server = spawnProcess("server");

    console.log("watching", process.cwd());
    var changedTimer;
    fs.watch(process.cwd(), {recursive: true}, function (event, filename) {
        clearTimeout(changedTimer);
        changedTimer = setTimeout(function () {
            console.log(chalk.yellow("[change detected] restarting server…", filename));
            server.kill();
            server = spawnProcess("server");
        }, 500);
    });
}

script();

