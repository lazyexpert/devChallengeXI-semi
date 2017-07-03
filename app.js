/**
 * Module: APP-CONTAINER
 * Description: container for services, in future delete and move the configs to aws
 * Activity: install dependencies, launch all services, and as far as such chance - combine logs streaming.
 */
const child_process = require('child_process');
const path = require('path');
const fork = child_process.fork;

const highland = require('highland');
const moment = require('moment');
const colors = require('colors');

const hosts = require('./common_modules/hosts');
const hostsKeys = Object.keys(hosts);

// Promisify exec
const exec = function(cmd) {
  return new Promise( (resolve ,reject) => {
    child_process.exec(cmd, (err, stdout) => {
      if (err) return reject(err);
      else return resolve(stdout);
    });
  });
};

// Generate docs
async function generateDocs() {
  await exec('npm run generate-docs');
  writePrettyOuput('Application documentation generated\n');
}

// Install all dependencies
async function installDependencies() {
  for (let key of hostsKeys)
    await exec(`cd ${key} && npm i`);
}

// Function forks process and transform stdout and stderr streams
function forkProcess(servicePath, name) {
  const child = fork(servicePath, {silent: true});

  highland(child.stdout).each(value => {
    process.stdout.write(format(name, 'log', value));
  });

  highland(child.stderr).each(value => {
    process.stderr.write(format(name, 'error', value));
  });
  process.on('SIGINT', () => child.send('SIGINT'));
}

// Launch all services
function launchServices() {
  for (let key of hostsKeys) {
    forkProcess(path.join(__dirname, `./${key}/app.js`), key);
  }

  // Launch indexator
  forkProcess(path.join(__dirname, './indexator/app.js'), 'indexator');

  // Launch docs server
  const port = process.env.DOC_SERVER_PORT || 3010;

  exec(`http-server docs/ -p ${port}`)
    .catch(e => e);

  writePrettyOuput(`Docs server launched at port: ${port}\n`);
}

// formatter for inner use
function writePrettyOuput(data) {
  process.stdout.write(format('app-container', 'log', data));
}

// formatter
function format(service, level, value) {
  const time = moment.utc().format('LT');
  const message = colors.yellow(`${time} ${service}: `) +
    (level === 'error' ? colors.red(value) : colors.green(value));
  return message;
}

// start flow
async function start() {
  await installDependencies();

  writePrettyOuput('All dependencies done\n');

  await generateDocs();

  launchServices();
}


start();