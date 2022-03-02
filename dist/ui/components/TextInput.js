"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const ink_text_input_1 = __importDefault(require("ink-text-input"));
const TextInput = ({ label, value, onChange, onSubmit, }) => {
    const handleChange = (q) => {
        onChange(q);
    };
    const handleSubmit = () => {
        onSubmit();
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { marginRight: 1 },
                react_1.default.createElement(ink_1.Text, null, "Enter message: ")),
            react_1.default.createElement(ink_text_input_1.default, { value: value, onChange: handleChange, onSubmit: handleSubmit }))));
};
exports.default = TextInput;
//# sourceMappingURL=TextInput.js.map