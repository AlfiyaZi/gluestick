/* @flow */

const spawn = require("cross-spawn");
const path = require("path");
import type { Context } from  "../types.js";

// Creates patch to dependency's bin directory
const getDependencyPath = name =>
  path.join(__dirname, '..', '..', 'node_modules', '.bin', name);

// `opts` is array of options with Command object attached as last element
module.exports = function(context: Context, dependencyName: string, ...opts: Array<*>) {
  spawn(
    getDependencyPath(dependencyName),
    opts[opts.length - 1].parent.rawArgs.slice(4),
    {
      stdio: 'inherit',
    },
  );
};
