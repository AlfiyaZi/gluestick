/** DO NOT MODIFY **/
import React, { Component } from "react";

import { Root } from "gluestick";
import routes from "./routes";
import store from "./._store";

export default class Entry extends Component {
    render () {
        const {
            routingContext,
            radiumConfig
        } = this.props;

        return (
            <Root routingContext={routingContext} radiumConfig={radiumConfig} routes={routes} store={store} />
        );
    }
}

