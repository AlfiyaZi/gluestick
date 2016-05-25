# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]
- Check whether docker is installed before calling it [#179](https://github.com/TrueCar/gluestick/pull/179)

## 0.7.1 - 2016-05-24
### Added
- Add support for custom webpack plugins [#184](https://github.com/TrueCar/gluestick/pull/184) 
- Add way to render server side errors without colors [#184](https://github.com/TrueCar/gluestick/pull/181)
- Ability to build separate vendor bundle for dependencies [#182](https://github.com/TrueCar/gluestick/pull/182)

### Changed
- Improve production mode [#186](https://github.com/TrueCar/gluestick/pull/186)

### Fixed
- Fix reference to NODE_ENV variable for webpack isomorphic tools [#185](https://github.com/TrueCar/gluestick/pull/186/files)

## 0.7.0 - 2016-05-20
### Added
- Ability to pass directories to the gluestick destroy command [#166](https://github.com/TrueCar/gluestick/pull/166) 
- Ability to pass directories to the gluestick generate command [#164](https://github.com/TrueCar/gluestick/pull/164) 
- Allow customizations to HTTP client in config [#161](https://github.com/TrueCar/gluestick/pull/161)

### Changed
- Update Gluestick Docker file to opitimize Gluestick base image [#174](https://github.com/TrueCar/gluestick/pull/174)
- Update npm dependencies for Gluestick and its apps [#176](https://github.com/TrueCar/gluestick/pull/176)
- Update README to better convey use case [#175](https://github.com/TrueCar/gluestick/pull/175)
- Supress errors during coverage report generation [#169](https://github.com/TrueCar/gluestick/pull/175)

### Fixed
- Set base URL on proxied requests and fix origin URL [#177](https://github.com/TrueCar/gluestick/pull/177)

## 0.3.0
[improved eslintrc defaults](https://github.com/TrueCar/gluestick/pull/78)

[Upgrade to Babel 6](https://github.com/TrueCar/gluestick/pull/77)

[Updating packages and logic to handle react-router 2.0.0. Note: This …](https://github.com/TrueCar/gluestick/pull/76)

[Add coverage reporting](https://github.com/TrueCar/gluestick/pull/75)

[Add flow header to generated files and update containers](https://github.com/TrueCar/gluestick/pull/74)

[Add support for async routes](https://github.com/TrueCar/gluestick/pull/73)

[Adding tests for CLI destroy command](https://github.com/TrueCar/gluestick/pull/72)

[improve chunk names, improve proxy headers](https://github.com/TrueCar/gluestick/pull/71)

[Have webpack ignore server files](https://github.com/TrueCar/gluestick/pull/70)

[Clean up and standardize console.log calls](https://github.com/TrueCar/gluestick/pull/69)

[CLI tests for the `generate` command: Part 2](https://github.com/TrueCar/gluestick/pull/68)

## 0.2.3
[use node_modules/.bin/pm2](https://github.com/TrueCar/gluestick/pull/67)

## 0.2.2
[Expose specified environment variables to client](https://github.com/TrueCar/gluestick/pull/65)

[Add --debug, -D mode for server side debugging](https://github.com/TrueCar/gluestick/pull/64)

[Fix generator bug, create folders if missing](https://github.com/TrueCar/gluestick/pull/63)

[Add a check for the extensions property](https://github.com/TrueCar/gluestick/pull/62)

[Add support to load css files from npm modules](https://github.com/TrueCar/gluestick/pull/61)

[Specify GlueStick version in Dockerfile](https://github.com/TrueCar/gluestick/pull/60)

[Fix update-package](https://github.com/TrueCar/gluestick/pull/59)

[Stop tailing log file, use pm2 logs method](https://github.com/TrueCar/gluestick/pull/58)

[PM2: move to using `delete` instead of `stop`](https://github.com/TrueCar/gluestick/pull/57)


## 0.2.1
[Add `dockerize` command](https://github.com/TrueCar/gluestick/pull/56)

[Add more tests for `gluestick new` cli](https://github.com/TrueCar/gluestick/pull/55)

[Fix 404 generator and instructions](https://github.com/TrueCar/gluestick/pull/54)

[Setup test script](https://github.com/TrueCar/gluestick/pull/53)

## 0.2.0
[Fix 404 generator and instructions](https://github.com/TrueCar/gluestick/pull/54)

[Setup test script](https://github.com/TrueCar/gluestick/pull/53)

[Move webpack-isomorphic-tools-configuration inside src/](https://github.com/TrueCar/gluestick/pull/52)

[Generate Reducer and Container tests](https://github.com/TrueCar/gluestick/pull/51)

[Create log file if it doesn't exist](https://github.com/TrueCar/gluestick/pull/50)

[Fix style flicker issue in dev mode](https://github.com/TrueCar/gluestick/pull/49)

[Webpack additions to allow `include`, `exclude`, and `query`](https://github.com/TrueCar/gluestick/pull/48)

[Enable css hotloading in development mode](https://github.com/TrueCar/gluestick/pull/46)

[Show pm2 output log and improve pm2 stop](https://github.com/TrueCar/gluestick/pull/45)

[Fix bug with `webpack-additions` missing file](https://github.com/TrueCar/gluestick/pull/44)

[Extendable Webpack](https://github.com/TrueCar/gluestick/pull/42)

[Upgrade karma version](https://github.com/TrueCar/gluestick/pull/41)

[Custom redux middleware](https://github.com/TrueCar/gluestick/pull/40)

[Only stop processes belonging to gluestick](https://github.com/TrueCar/gluestick/pull/39)

[Added a catch all command to the CLI](https://github.com/TrueCar/gluestick/pull/38)

[Add destroy to the CLI](https://github.com/TrueCar/gluestick/pull/37)

[Add option to run terts in Firefox instead of Chrome](https://github.com/TrueCar/gluestick/pull/36)

[fix redux dev tools](https://github.com/TrueCar/gluestick/pull/35)

[Use PM2 for server side rendering](https://github.com/TrueCar/gluestick/pull/34)

[Improve shared package management](https://github.com/TrueCar/gluestick/pull/33)

[Add `gsBeforeRoute` and deprecate `fetchData`](https://github.com/TrueCar/gluestick/pull/32)

[Windows support](https://github.com/TrueCar/gluestick/pull/31)


## 0.1.10
[Adding the ability to use and ENV variable to override port](https://github.com/TrueCar/gluestick/pull/29)

[add eslint dev dependencies](https://github.com/TrueCar/gluestick/pull/28)

[Adding ASSET_URL endpoint into the generated application.js](https://github.com/TrueCar/gluestick/pull/27)

[add webpack asset bundle data file to gitignore](https://github.com/TrueCar/gluestick/pull/26)

[Add support for custom 404 handler](https://github.com/TrueCar/gluestick/pull/25)

[convert from 4 tabs to 2 tabs](https://github.com/TrueCar/gluestick/pull/24)

[Add .eslintrc to new projects](https://github.com/TrueCar/gluestick/pull/23)

[Add support for custom 505 error pages](https://github.com/TrueCar/gluestick/pull/22)

[Only include DevTools in dev mode](https://github.com/TrueCar/gluestick/pull/21)

[Fix shared `store` instance bug](https://github.com/TrueCar/gluestick/pull/20)

[Render simple loading page during server restarts](https://github.com/TrueCar/gluestick/pull/19)

[Return value from the Promise Middleware](https://github.com/TrueCar/gluestick/pull/18)

## 0.1.9
[Fix tests that load non javascript files] (https://github.com/TrueCar/gluestick/pull/17)

[Fix npm start](https://github.com/TrueCar/gluestick/pull/16)

## 0.1.8
[Refine watch to avoid unnecessary server restarts.](https://github.com/TrueCar/gluestick/commit/1d02b2d913ca39c15c770207684e90a5ab8abdb0)

[Use commander for cli](https://github.com/TrueCar/gluestick/commit/faf3c1e8c4f2b94097fea92412766c2047e6b754)

[add matchMedia polyfill (IE9)](https://github.com/TrueCar/gluestick/commit/fc651aa98e5278cce0bbe7eddc39974b6df59254)

[stop being so strict with css loader](https://github.com/TrueCar/gluestick/commit/f304e40c993070ae8ac5a6aef5ce5f1a5feeaf74)

[fix generator .gitignore issue](https://github.com/TrueCar/gluestick/commit/3149c0a0ee12d8d7cf5f4a161c090f2a337a1852)

