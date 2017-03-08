const path = require('path');
const fs = require('fs');
const mkdir = require('mkdirp');
const spawn = require('cross-spawn');
const commander = require('commander');
const glob = require('glob');
const generate = require('gluestick-generators');
const version = require('./package.json').version;

module.exports = (appName, options, exitWithError) => {
  const packageDeps = {
    dependencies: {
      gluestick: version,
    },
  };
  if (options.dev) {
    const pathToGluestickRepo = path.join(process.cwd(), appName, '..', options.dev);
    const pathToGluestickPackages = path.join(pathToGluestickRepo, 'packages');
    let gluestickPackage = {};
    const packages = glob.sync('*', { cwd: pathToGluestickPackages }).filter((e) => e !== 'gluestick-cli');
    try {
      gluestickPackage = require(path.join(pathToGluestickRepo, 'package.json'));
    } catch (error) {
      exitWithError(
        `Development GlueStick path ${pathToGluestickRepo} is not valid`,
      );
    }
    if (gluestickPackage.name !== 'gluestick-packages') {
      exitWithError(
        `${pathToGluestickRepo} is not a path to GlueStick`,
      );
    }
    packages.forEach(e => {
      packageDeps.dependencies[e] = path.join('..', options.dev, 'packages', e);
    });
  }
  const pathToApp = path.join(process.cwd(), appName);
  if (fs.existsSync(pathToApp)) {
    exitWithError(
      `Directory ${pathToApp} already exists`,
    );
  }
  mkdir.sync(path.join(process.cwd(), appName));

  const generatorOptions = {
    dev: options.dev || null,
    appName,
  };

  const logger = {
    info: console.log,
    success: console.log,
    error: console.log,
    warn: console.log,
  };

  process.chdir(appName);

  generate(
    {
      generatorName: 'package',
      entityName: 'package',
      options: generatorOptions,
    },
    logger,
  );

  spawn.sync(
    options.yarn ? 'yarn' : 'npm',
    ['install'],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );
  spawn.sync(
    './node_modules/.bin/gluestick',
    commander.rawArgs.slice(2),
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );
};
