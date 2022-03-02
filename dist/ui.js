"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const App = () => (react_1.default.createElement(ink_1.Box, { margin: 2 },
    react_1.default.createElement(ink_1.Text, null, "This is a box with margin")));
module.exports = App;
exports.default = App;
