"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_table_1 = __importDefault(require("ink-table"));
const ink_1 = require("ink");
const moment_1 = __importDefault(require("moment"));
const color_hash_1 = __importDefault(require("color-hash"));
var colorHash = new color_hash_1.default();
const CustomCell = ({ children }) => {
    // @ts-ignore
    const innerText = children.toString().trim();
    const color = innerText.startsWith("#") ? innerText : "gray";
    return (
    // <Box borderStyle="single" borderColor="yellow">
    // @ts-ignore
    react_1.default.createElement(ink_1.Text, { color: color }, children)
    // </Box>
    );
};
const Data = ({ messages }) => {
    if (!messages || messages.length === 0)
        return null;
    // const mappedData = useMemo(() => {
    // 	const newData = [...messages];
    // 	return newData.map((obj) => {
    // 		return {
    // 			Id: obj.userId,
    // 			Text: obj.content,
    // 		};
    // 	});
    // }, []);
    const mappedMessages = messages.map((message) => {
        return {
            Time: (0, moment_1.default)(message.timestamp).fromNow(),
            User: colorHash.hex(message.userId),
            Text: message.content,
        };
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_table_1.default, { data: mappedMessages, cell: CustomCell })));
};
exports.default = Data;
//# sourceMappingURL=Table.js.map