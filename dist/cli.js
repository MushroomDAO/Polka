#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const meow_1 = __importDefault(require("meow"));
const App_1 = __importDefault(require("./ui/App"));
const PubsubProvider_1 = require("./ui/contexts/PubsubProvider");
const cli = (0, meow_1.default)(`
  Usage
    $ polka <frequency>   // the channel you want to connect to. Can be anything.
    $ polka --version
    $ polka --help
  

  Examples
    $ polka russia
    $ polka               // Will connect you to our default channel #polka
    $ polka --version
`);
(0, ink_1.render)(react_1.default.createElement(PubsubProvider_1.PubsubProvider, null,
    react_1.default.createElement(App_1.default, { frequency: cli.input[0] || "polka" })));
//# sourceMappingURL=cli.js.map