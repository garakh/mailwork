'use strict';
var gulp = require('gulp');
var fs = require('fs');
var inquirer = require('inquirer');
var exec = require('child_process').exec;
var filename = 'config.json';
var configFolder = './src/Config/';
//var configFolder = './';

gulp.task('_composer', function (cb) {
    return exec('composer install', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('_bower', function (cb) {
    return exec('bower install', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', ['_bower', '_composer']);

gulp.task('setup', function (done) {
    var config =
    {
        "search": {
            "date-modifier": "-3 month"
        },
        "authorization": {
            "secret-token": ""
        },
        "mail-settings": {
            "email": "",
            "imap-server": "",
            "smtp-server": "",
            "imap-port": "",
            "smtp-port": "",
            "username": "",
            "password": "",
            "search-mailbox-in": [],
            "search-mailbox-out": [],
            "copy-sent-to": "",
        },
        "cache-settings": {
            "path" : "/../cache",
            "ttl" : 300
        }
    };
    var filterMailboxes = function (input) {
        return new Promise(function (resolve) {
            var names = input.split(',');
            names = names.map(function (name) {
                return name.trim();
            });
            names = names.filter(function (name) {
                return name !== "";
            });
            resolve(names);
        });
    }

    var prompt = inquirer.createPromptModule();
    prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter email:',
            validate: function (input) {
                var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return new Promise(function (resolve, reject) {
                    if (!input.match(re)) reject(false);
                    resolve(true);
                });

            }
        },{
            type: 'input',
            name: 'username',
            message: 'Enter username:'
        },{
            type: 'password',
            name: 'password',
            message: 'Enter password:'
        },{
            type: 'list',
            name: 'imap-server',
            message: 'Choose imap server from list:',
            choices: ["imap.gmail.com", "imap.yandex.ru", "custom"],
        },{
            type: 'input',
            name: 'imap-server-custom',
            message: 'Enter imap server address:',
            when: function (answers) {
                return answers['imap-server'] === "custom";
            }
        },{
            type: 'input',
            name: 'imap-port',
            message: 'Enter imap port (default 993):',
            default: "993",
            validate: function (input) {
                return new Promise(function (resolve, reject) {
                    var re = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
                    if(!input) resolve(true);
                    if ((!input.match(re))) reject(false);
                    resolve(true);
                });
            }
        },{
            type: 'list',
            name: 'smtp-server',
            message: 'Choose smtp server from list:',
            choices: ["smtp.gmail.com", "smtp.yandex.ru", "custom"],
        },{
            type: 'input',
            name: 'smtp-server-custom',
            message: 'Enter smtp server address:',
            when: function (answers) {
                return answers['smtp-server'] === "custom";
            }
        },{
            type: 'input',
            name: 'smtp-port',
            message: 'Enter smtp port (default 587):',
            default: "587",
            validate: function (input) {
                return new Promise(function (resolve, reject) {
                    var re = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
                    if(!input) resolve(true);
                    if ((!input.match(re))) reject(false);
                    resolve(true);
                });
            }
        },{
            type: 'password',
            name: 'secret-token',
            message: 'Enter secret-token:'
        },{
            type: 'input',
            name: 'search-mailbox-in',
            message: 'Enter mailbox names for incoming mail (separate multiple with , ):',
            filter: filterMailboxes
        },{
            type: 'input',
            name: 'search-mailbox-out',
            message: 'Enter mailbox names for sent mail (separate multiple with , ):',
            filter: filterMailboxes
        },{
            type: 'input',
            name: 'copy-sent-to',
            message: 'Enter mailbox name that will store a copy of outgoing message:'
        }
    ]).then(function (answers) {
        config['authorization']['secret-token'] = answers['secret-token'];
        config['mail-settings'].email = answers.email;
        config['mail-settings'].username = answers.username;
        config['mail-settings'].password = answers.password;
        config['mail-settings']['imap-server'] = answers['imap-server-custom']?answers['imap-server-custom']:answers['imap-server'];
        config['mail-settings']['imap-port'] = answers['imap-port'];
        config['mail-settings']['smtp-server'] = answers['smtp-server-custom']?answers['smtp-server-custom']:answers['smtp-server'];
        config['mail-settings']['smtp-port'] = answers['smtp-port'];
        config['mail-settings']['search-mailbox-in'] = answers['search-mailbox-in'];
        config['mail-settings']['search-mailbox-out'] = answers['search-mailbox-out'];
        config['mail-settings']['copy-sent-to'] = answers['copy-sent-to'];
        fs.writeFile(configFolder + filename, JSON.stringify(config, null, 2), done);
    });
});