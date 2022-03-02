"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const Info = ({ frequency, connections, }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, { display: "flex", flexDirection: "row" },
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "gray", flexGrow: 3, justifyContent: "center" },
                react_1.default.createElement(ink_1.Text, { color: "yellowBright" }, `Connected to: #${frequency}`)),
            react_1.default.createElement(ink_1.Box, { borderStyle: "single", borderColor: "gray", flexGrow: 1, justifyContent: "center" },
                react_1.default.createElement(ink_1.Text, { color: "greenBright" }, `Connections: ${connections || 0}`)))));
};
exports.default = Info;
//# sourceMappingURL=Info.js.map