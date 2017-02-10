/* @flow */

import type { Context, Logger } from '../types';

const path = require('path');
const spawn = require('cross-spawn');

const { highlight, filename } = require('../cli/colorScheme');
const generate = require('../generator');

type ProjectData = {
  dependencies: {
    gluestick: string,
  }
}

const generateTemplate = (generatorName: string, entityName: string, logger: Logger) => {
  generate({
    generatorName,
    entityName,
  }, logger);
};

const currentlyInProjectFolder = (folderPath: string) => {
  const fileName: string = path.join(folderPath, 'package.json');
  let data: ?ProjectData = null;
  try {
    data = require(fileName);
    return !!data.dependencies && !!data.dependencies.gluestick;
  } catch (e) {
    return false;
  }
};

module.exports = ({ logger }: Context, appName: string) => {
  if (currentlyInProjectFolder(process.cwd())) {
    logger.info(`${filename(appName)} is being generated...`);

    generateTemplate('new', appName, logger);
    spawn.sync('npm', ['install'], { stdio: 'inherit' });

    logger.info(`${highlight('New GlueStick project created')} at ${filename(process.cwd())}`);
    logger.info('To run your app and start developing');
    logger.info(`    cd ${appName}`);
    logger.info('    gluestick start');
    logger.info('    Point the browser to http://localhost:8888');

    process.exit(0);
  }
};
