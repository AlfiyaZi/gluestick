/*global webpackIsomorphicTools*/
import path from "path";
import { createElement } from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import NodeCache from "node-cache";

import {
  runBeforeRoutes,
  prepareRoutesWithTransitionHooks,
  ROUTE_NAME_404_NOT_FOUND
} from "gluestick-shared";

import { match, RouterContext } from "react-router";
import errorHandler from "./errorHandler";
import Body from "./Body";
import getHead from "./getHead";
import getRenderRequirementsFromEntrypoints from "./getRenderRequirementsFromEntrypoints";

// E-mail support
import Oy from "oy-vey";
const HTML5 = "<!DOCTYPE html>";

import { getLogger } from "./logger";
const logger = getLogger();
import showHelpText, { MISSING_404_TEXT } from "./helpText";


process.on("unhandledRejection", (reason) => {
  const message = reason.message || reason.statusText || reason;
  logger.error(reason, "Unhandled promise rejection:", message);
});

const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 600 // how frequently to clear out expired TTL
});

module.exports = async function (req, res) {
  // Forward all request headers from the browser into http requests made by node
  let config;
  try {
    config = require(path.join(process.cwd(), "src", "config", "application")).default;
    const Entry = require(path.join(process.cwd(), "src/config/.entry")).default;
    const { Index, store, getRoutes, fileName } = getRenderRequirementsFromEntrypoints(req, res, config);

    const routes = prepareRoutesWithTransitionHooks(getRoutes(store));

    match({routes: routes, location: req.path}, async (error, redirectLocation, renderProps) => {
      try {
        if (error) {
          errorHandler(req, res, error, config);
        }
        else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
          // Check if the route has cache preferences
          const currentRoute = renderProps.routes[renderProps.routes.length - 1];
          const cacheKey = currentRoute.cacheKey || `${req.host}/${req.url}`;
          if (currentRoute.cache) {
            logger.debug(`Cache is on for route ${cacheKey}`);
            const cachedResponse = cache.get(cacheKey);
            if (cachedResponse) {
              logger.debug(`serving cached response for ${cacheKey}`);
              res.status(cachedResponse.status);
              res.end(cachedResponse.responseData);
              return;
            }
          }

          // If we have a matching route, set up a routing context so
          // that we render the proper page. On the client side, you
          // embed the router itself, on the server you embed a routing
          // context.
          // [https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md]
          await runBeforeRoutes(store, renderProps || {}, {isServer: true, request: req});

          const routerContext = createElement(RouterContext, renderProps);

          // grab the main component which is capable of loading routes
          // and hot loading them if in development mode
          const radiumConfig = { userAgent: req.headers["user-agent"] };

          const main = createElement(Entry, {store, routerContext, config, radiumConfig, getRoutes});

          // gather attributes that were included on the route in order to
          // determine whether to render as an e-mail or not
          const routeAttrs = getEmailAttributes(renderProps.routes);
          const isEmail = routeAttrs.email;
          const reactRenderFunc = isEmail ? renderToStaticMarkup : renderToString;

          // grab the react generated body stuff. This includes the
          // script tag that hooks up the client side react code.
          const currentState = store.getState();
          const body = createElement(Body, {html: reactRenderFunc(main), entryPoint: fileName, config: config, initialState: currentState, isEmail: isEmail});
          const head = isEmail ? null : getHead(config, fileName, webpackIsomorphicTools.assets()); // eslint-disable-line webpackIsomorphicTools


          // Grab the html from the project which is stored in the root
          // folder named Index.js. Pass the body and the head to that
          // component. `head` includes stuff that we want the server to
          // always add inside the <head> tag.
          //
          // Bundle it all up into a string, add the doctype and deliver
          const rootElement = createElement(Index, {body: body, head: head});

          // Set status code
          let status;
          if (renderProps.routes[renderProps.routes.length - 1].name === ROUTE_NAME_404_NOT_FOUND) {
            status = 404;
          }
          else {
            // Use the error's status code that was set on GlueStick's internal
            // state object if one exists
            const errorStatus = getErrorStatusCode(currentState);
            if (errorStatus !== null) {
              status = errorStatus;
            }
            else {
              status = 200;
            }
          }

          let responseData;
          if (isEmail) {
            const generateCustomTemplate = ({bodyContent}) => { return `${bodyContent}`; };
            responseData = routeAttrs.docType + "\n" + Oy.renderTemplate(rootElement, {}, generateCustomTemplate);
          }
          else {
            responseData = routeAttrs.docType + "\n" + reactRenderFunc(rootElement);
          }

          // If caching has been enabled for this route, cache response for
          // next time it is requested
          if (currentRoute.cache) {
            logger.debug(`Caching response for ${cacheKey} - ${currentRoute.cacheTTL}`);
            cache.set(cacheKey, {
              status,
              responseData
            }, currentRoute.cacheTTL);
          }

          res.status(status);
          res.send(responseData);
        }
        else {
          // This is only hit if there is no 404 handler in the react routes. A
          // not found handler is included by default in new projects.
          showHelpText(MISSING_404_TEXT);
          res.status(404).send("Not Found");
        }
      }
      catch (error) {
        // Always return a 500 for exceptions
        errorHandler(req, res, error, config);
      }
    });
  }
  catch (error) {
    errorHandler(req, res, error, config);
  }
};

function getEmailAttributes (routes) {
  const lastRoute = routes[routes.length - 1];
  const email = lastRoute.email || false;
  const docType = lastRoute.docType || HTML5;
  return { email, docType };
}

function getErrorStatusCode (state) {
  if (state._gluestick.hasOwnProperty("statusCode")) {
    return state._gluestick.statusCode;
  }
  return null;
}

