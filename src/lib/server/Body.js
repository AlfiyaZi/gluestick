/*eslint-disable react/no-danger*/
import React, { Component, PropTypes} from "react";
import serialize from "serialize-javascript";

import getAssetPathForFile from "../getAssetPathForFile";

export default class Body extends Component {
  static propTypes = {
    main: PropTypes.string.object,
    isEmail: PropTypes.bool.isRequired,
    entryPoint: PropTypes.string.isRequired,
    initialState: PropTypes.any.isRequired
  };

  render () {
    const { isEmail } = this.props;

    if (isEmail) { return this._renderWithoutScriptTags(); }
    return this._renderWithScriptTags();
  }

  _renderWithoutScriptTags () {
    return (
      <div>
        { this.props.main }
      </div>
    );
  }

  _renderWithScriptTags () {
    const {
      initialState,
      entryPoint
    } = this.props;

    return (
      <div>
        { this.props.main }
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(initialState, {isJSON: true})};`}}></script>
        <script type="text/javascript" src={getAssetPathForFile("commons", "javascript")}></script>
        <script type="text/javascript" src={getAssetPathForFile("vendor", "javascript")}></script>
        <script type="text/javascript" src={getAssetPathForFile(entryPoint, "javascript")} async></script>
      </div>
    );
  }
}

