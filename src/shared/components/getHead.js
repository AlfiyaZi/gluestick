import React, { Component } from "react";
import serialize from "serialize-javascript";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export default (config, assets) => {
  let tags = [];
  let key = 0;

  if (isProduction) {
    tags.push(<link key={key++} rel="stylesheet" type="text/css" href={`${config.assetPath}/main.css`} />);
  }
  else {
    // Resolve style flicker on page load in dev mode
    Object.keys(assets.assets).forEach(assetPath => {
      if (!assetPath.endsWith(".css")) return;
      tags.push(<style key={key++} dangerouslySetInnerHTML={{__html: require(path.join(process.cwd(), assetPath))}} />);
    });
  }

  tags.push(
    <script key={key++} type="text/javascript" dangerouslySetInnerHTML={{__html: `window.__GS_ENVIRONMENT__ = ${serialize(process.env.NODE_ENV)}`}}></script>
  );

  return tags;
};

