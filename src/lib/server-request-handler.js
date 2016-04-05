import chalk from "chalk";
import path from "path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { runBeforeRoutes, ROUTE_NAME_404_NOT_FOUND, prepareRoutesWithTransitionHooks } from "gluestick-shared";
import { match, RouterContext, Route } from "react-router";
import showHelpText, { MISSING_404_TEXT } from "../lib/help-text";
import logger from "./logger";

import serverErrorHandler from "./server-error-handler";
import Body from "../shared/components/Body";
import getHead from "../shared/components/getHead";

process.on("unhandledRejection", (reason, promise) => {
  console.log(chalk.red(reason), promise);
});

module.exports = async function (req, res) {
  try {
    const Index = require(path.join(process.cwd(), "Index")).default;
    const Entry = require(path.join(process.cwd(), "src/config/.entry")).default;
    const store = require(path.join(process.cwd(), "src/config/.store")).default();
    let originalRoutes = require(path.join(process.cwd(), "src/config/routes")).default;

    // @TODO: Remove this in the future when people have had enough time to
    // upgrade.  When this deprecation notice and backward compatibility check
    // are removed, remove from new/src/config/.entry as well
    if (typeof originalRoutes !== "function") {
      logger.warn(`
##########################################################################
Deprecation Notice: src/config/routes.js is expected to export a
function that returns the routes object, not the routes object
itself. This gives you access to the redux store so you can use it
in async react-router methods. For a simple example see:
https://github.com/TrueCar/gluestick/blob/develop/new/src/config/routes.js
##########################################################################
`);
      originalRoutes = () => originalRoutes;
    }

    const config = require(path.join(process.cwd(), "src/config/application")).default;
    const routes = prepareRoutesWithTransitionHooks(originalRoutes);
    match({routes: routes, location: req.path}, async (error, redirectLocation, renderProps) => {
      try {
        if (error) {
          serverErrorHandler(req, res, error);
        }
        else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
          // If we have a matching route, set up a routing context so
          // that we render the proper page. On the client side, you
          // embed the router itself, on the server you embed a routing
          // context.
          // [https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md]
          await runBeforeRoutes(store, renderProps || {}, {isServer: true, request: req});
          const routerContext = createElement(RouterContext, renderProps);

          // grab the main component which is capable of loading routes
          // and hot loading them if in development mode
          const radiumConfig = { userAgent: req.headers["user-agent"] };
          const main = createElement(Entry, {store: store, routerContext: routerContext, config: config, radiumConfig: radiumConfig});

          // grab the react generated body stuff. This includes the
          // script tag that hooks up the client side react code.
          const body = createElement(Body, {html: renderToString(main), config: config, initialState: store.getState()});
          const head = getHead(config, webpackIsomorphicTools.assets());

          if (renderProps.routes[renderProps.routes.length - 1].name === ROUTE_NAME_404_NOT_FOUND) {
            res.status(404);
          }
          else {
            res.status(200);
          }

          // Grab the html from the project which is stored in the root
          // folder named Index.js. Pass the body and the head to that
          // component. `head` includes stuff that we want the server to
          // always add inside the <head> tag.
          //
          // Bundle it all up into a string, add the doctype and deliver
          res.send("<!DOCTYPE html>\n" + renderToString(createElement(Index, {body: body, head: head})));
        }
        else {
          // This is only hit if there is no 404 handler in the react routes. A
          // not found handler is included by default in new projects.
          showHelpText(MISSING_404_TEXT);
          res.status(404).send("Not Found");
        }
      }
      catch (error) {
        serverErrorHandler(req, res, error);
      }
    });
  }
  catch (error) {
    serverErrorHandler(req, res, error);
  }
};

