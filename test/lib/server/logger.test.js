/*global beforeEach describe it*/
import { expect } from "chai";
import {
  pinoBaseConfig,
  setupLogParams
} from "../../../src/lib/server/logger";

describe("lib/server/logger", () => {

  const defaultConfig = {...pinoBaseConfig};

  describe("setupLogParams()", () => {

    describe("when no custom configuration is provided", () => {
      it("sets up logging with proper defaults", () => {
        const result = setupLogParams({});
        expect(result).to.deep.equal({
          logConfig: {
            ...defaultConfig
          },
          prettyConfig: null
        });
      });
    });

    describe("when a custom configuration is provided", () => {
      it("overrides the default level with the level provided", () => {
        const result = setupLogParams({level: "info"});
        expect(result).to.deep.equal({
          logConfig: {
            ...defaultConfig,
            level: "info"
          },
          prettyConfig: null
        });
      });

      it("overrides the pretty configuration with the one provided", () => {
        const result = setupLogParams({pretty: true});
        expect(result.prettyConfig).to.not.be.null;
      });
    });

    describe("when command line options are specified", () => {
      it("overrides the default level with the level provided", () => {
        process.env.GS_COMMAND_OPTIONS = JSON.stringify({logLevel: "debug"});
        const result = setupLogParams({});
        expect({
          logConfig: {
            name: "GlueStick",
            safe: true,
            level: "debug"
          },
          prettyConfig: null
        }).to.deep.equal(result);
        delete process.env.GS_COMMAND_OPTIONS;
      });

      it("overrides the app config level with the level provided", () => {
        process.env.GS_COMMAND_OPTIONS = JSON.stringify({logLevel: "debug"});
        const result = setupLogParams({level: "info"});
        expect({
          logConfig: {
            name: "GlueStick",
            safe: true,
            level: "debug"
          },
          prettyConfig: null
        }).to.deep.equal(result);
        delete process.env.GS_COMMAND_OPTIONS;
      });
    });
  });
});
