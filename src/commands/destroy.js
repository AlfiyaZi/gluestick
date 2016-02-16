var fs = require("fs");
var path = require("path");
var inquirer = require("inquirer");
const logger = require("../lib/logger");
const { _highlight, _filename } = logger;

var availableCommands = {
  "container": "containers",
  "component": "components",
  "reducer": "reducers"
};

// @NOTE, we use async here because we use await later in the function
module.exports = async function () {
  var command = process.argv[3];
  var name = process.argv[4];

  // Step 1: Check if we are in the root of a gluestick project by looking for the `.gluestick` file
  try {
    fs.statSync(path.join(process.cwd(), ".gluestick"));
  }
  catch (e) {
    logger.info(`.gluestick file not found`);
    logger.error(`${_highlight(destroy)} commands must be run from the root of a gluestick project.`);
    return;
  }

  // Step 2: Validate the command type by verifying that it exists in `availableCommands`
  if (!availableCommands[command]) {
    logger.error(`${_highlight(command)} is not a valid destroy command.`);
    logger.info(`Available destroy commands: ${Object.keys(availableCommands).map(c => _highlight(c)).join(", ")}`);
    return;
  }

  // Step 3: Validate the name by stripping out unwanted characters
  if (!name || name.length === 0) {
    logger.error(`invalid arguments. You must specify a name.`);
    return;
  }

  if (/\W/.test(name)) {
    logger.error(`${_highlight(name)} is not a valid name.`);
    return;
  }

  // Step 4: Possibly mutate the name by converting it to Pascal Case (only for container and component for now)
  var originalName = name; // store original name for later
  if (["container", "component"].indexOf(command) !== -1) {
    name = name.substr(0, 1).toUpperCase() + name.substr(1);
  }
  if (["reducer", "action-creator"].indexOf(command) !== -1) {
    name = name.substr(0, 1).toLowerCase() + name.substr(1);
  }

  // Step 5: Remove the file
  var destinationPath = path.join(process.cwd(), "/src/", availableCommands[command] + "/" + name + ".js");
  var fileExists = true;
  try {
    fs.statSync(destinationPath);
  }
  catch (e) {
    fileExists = false;
  }

  if (fileExists) {
    // If they typed a name that would normally be mutated, check with the user first before deleting the files
    if (originalName !== name) {
      // @NOTE: We are using await so that we can wait for the result of the promise before moving on
      const continueDestroying = await new Promise((resolve, reject) => {
        const question = {
          type: "confirm",
          name: "confirm",
          message: `You wanted to destroy ${_filename(originalName)} but the generated name is ${_filename(name)}.\nWould you like to continue with destroying ${_filename(name)}?`
        };
        inquirer.prompt([question], function (answers) {
          if (!answers.confirm) resolve(false);
          resolve(true);
        });
      });

      // Since we used await, this code will not be executed until the promise above resolves
      if (!continueDestroying) process.exit();
    }

    fs.unlinkSync(destinationPath);
    logger.success(`Removed file: ${_filename(destinationPath)}`);
  }
  else {
    logger.error(`${_filename(destinationPath)} does not exist`);
    return;
  }

  // Step 6: If we destroyed a reducer, remove it from the reducers index
  if (command === "reducer") {
    var reducerIndexPath = path.resolve(process.cwd(), "src/reducers/index.js");
    try {
      const indexLines = fs.readFileSync(reducerIndexPath, {encoding: "utf8"}).split("\n");
      const reducerLine = `export { default as ${name} } from "./${name}"`;
      const newIndexLines = indexLines.filter((indexLine) => {
        // Only return lines from the reducer index that do not return the reducer
        // we just destroyed. Check for semi colon and non-semi colon lines
        return indexLine !== reducerLine && indexLine !== `${reducerLine};`;
      });
      fs.writeFileSync(reducerIndexPath, newIndexLines.join("\n"));
      logger.success(`${_highlight(name)} removed from reducer index ${_filename(reducerIndexPath)}`);
    }
    catch (e) {
      logger.error(`Unable to modify reducers index. Reducer not removed from index`);
      return;
    }
  }

  // Step 7: Remove the test file
  var testPath = path.join(process.cwd(), "/test/", availableCommands[command], `/${name}.test.js`);
  var testFileExists = true;
  try {
    fs.statSync(testPath);
  }
  catch (e) {
    testFileExists = false;
  }

  if (testFileExists) {
    fs.unlinkSync(testPath);
    logger.success(`Removed file: ${_filename(testPath)}`);
  }
  else {
    logger.error(`${_filename(testPath)} does not exist`);
    return;
  }
};
