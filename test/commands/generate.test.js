/*global afterEach beforeEach describe it*/
import { expect } from "chai";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import glob from "glob";
import temp from "temp";
import rimraf from "rimraf";
import generate from "../../src/commands/generate";

function stubProject(type) {
    // Generate files that are already expected to exist
  const srcDir = path.join(process.cwd(), `src/${type}s`);
  fs.closeSync(fs.openSync(".gluestick", "w"));
  mkdirp.sync(srcDir);
  if (type === "reducer") {
    fs.closeSync(fs.openSync(path.join(srcDir, "index.js"), "w"));
  }
}

function makeGeneratedFilesAssertion(dir, type, name, done) {
  const expectedFiles = [
    ".gluestick",
    "src",
    `src/${type}s`,
    `src/${type}s/${name}.js`,
    "test",
    `test/${type}s`,
    `test/${type}s/${name}.test.js`
  ];
  const generatedFiles = new Set(glob.sync("**", {
    dot: true,
    cwd: path.resolve(dir)
  }));
  expect(expectedFiles.filter(f => !generatedFiles.has(f))).to.be.empty;
  done();
}

describe("cli: gluestick generate", function () {

  let originalCwd, tmpDir;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = temp.mkdirSync("gluestick-generate");
    process.chdir(tmpDir);
  });

  afterEach(done => {
    process.chdir(originalCwd);
    rimraf(tmpDir, done);
  });

  it("should report an error if an invalid command type was provided", () => {
    fs.closeSync(fs.openSync(".gluestick", "w"));
    generate("invalidtype", "myname", (err) => {
      expect(err).to.contain("is not a valid generator");
    });
  });

  it("should report an error if a blank name is provided", () => {
    fs.closeSync(fs.openSync(".gluestick", "w"));
    generate("container", "", (err) => {
      expect(err).to.contain("must specify a name");
    });
  });

  it("should report an error if non-word characters are in the name", () => {
    fs.closeSync(fs.openSync(".gluestick", "w"));
    generate("container", "f##@", (err) => {
      expect(err).to.contain("is not a valid name");
    });
  });

  it("should capitalize the name if the type is `container`", done => {
    const type = "container";
    stubProject(type);
    generate(type, "mycontainer", (err) => {
      expect(err).to.be.undefined;
      makeGeneratedFilesAssertion(process.cwd(), type, "Mycontainer", done);
    });
  });

  it("should capitalize the name if the type is `component`", done => {
    const type = "component";
    stubProject(type);
    generate(type, "mycomponent", (err) => {
      expect(err).to.be.undefined;
      makeGeneratedFilesAssertion(process.cwd(), type, "Mycomponent", done);
    });
  });

  it("should lowercase the name if the type is `reducer`", done => {
    const type = "reducer";
    stubProject(type);
    generate(type, "Myreducer", (err) => {
      expect(err).to.be.undefined;
      makeGeneratedFilesAssertion(process.cwd(), type, "myreducer", done);
    });
  });

  it("should not generate a container if it already exists", done => {
    const type = "container";
    stubProject(type);
    fs.closeSync(fs.openSync(path.join(process.cwd(), `src/${type}s/Mycontainer.js`), "w"));
    generate(type, "mycontainer", (err) => {
      expect(err).to.not.be.undefined;
      expect(err).to.contain("already exists");
      done();
    });
  });

  it("should generate a container that sets the document title", done => {
    const type = "container";
    stubProject(type);
    generate(type, "mycontainer", () => {
      const contents = fs.readFileSync(path.join(process.cwd(), `src/${type}s/Mycontainer.js`), "utf8");
      expect(contents).to.contain("<Helmet title=\"Mycontainer\"/>");
      done();
    });
  });

});
