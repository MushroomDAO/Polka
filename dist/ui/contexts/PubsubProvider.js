"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePubsubProvider = exports.PubsubProvider = exports.PubsubInternal = void 0;
const logger_1 = __importDefault(require("../../libs/logger"));
const react_1 = __importStar(require("react"));
const p2ppubsub_1 = __importDefault(require("../../libs/p2ppubsub"));
const pubsub = new p2ppubsub_1.default();
exports.PubsubInternal = (0, react_1.createContext)({
    publish: (frequency, message) => null,
    listen: (frequency) => null,
    messages: {},
    connections: {},
});
const PubsubProvider = ({ children }) => {
    const [messages, setMessages] = (0, react_1.useState)({});
    const [connections, setConnections] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        (0, logger_1.default)("init provider");
    }, []);
    const onPublish = (frequency, message) => {
        (0, logger_1.default)("[PubsubProvider] Publish: ", message);
        const data = pubsub.publish(frequency, message);
        (0, logger_1.default)("data", data);
        onNewMessage(data, frequency);
        return null;
    };
    const onNewMessage = (message, frequency) => {
        (0, logger_1.default)("[PubsubProvider] Message: ", message, frequency);
        setMessages((prevMessages) => {
            const prevFrequencyMessages = prevMessages[frequency] || [];
            return Object.assign(Object.assign({}, prevMessages), { [frequency]: [...prevFrequencyMessages, message] });
        });
    };
    const onConnectionClosed = (frequency) => {
        setConnections((prevConnections) => {
            const prevFrequencyConnections = prevConnections[frequency] - 1 || 1;
            return Object.assign(Object.assign({}, prevConnections), { [frequency]: prevFrequencyConnections });
        });
    };
    const onNewConnection = (frequency) => {
        setConnections((prevConnections) => {
            const prevFrequencyConnections = prevConnections[frequency] + 1 || 1;
            return Object.assign(Object.assign({}, prevConnections), { [frequency]: prevFrequencyConnections });
        });
    };
    const onListen = (frequency) => {
        (0, logger_1.default)("[PubsubProvider] Listen: ", frequency);
        const swarm = pubsub.subscribe(frequency);
        // LOGBRO("swarm", swarm);
        swarm.on("message", (message) => onNewMessage(message, frequency));
        swarm.on("connected", (connection) => onNewConnection(frequency));
        swarm.on("connection-closed", () => onConnectionClosed(frequency));
    };
    (0, logger_1.default)("MESSAGES", JSON.stringify(messages), 2);
    (0, logger_1.default)("");
    return (react_1.default.createElement(exports.PubsubInternal.Provider, { value: {
            publish: onPublish,
            listen: onListen,
            messages,
            connections,
        } }, children));
};
exports.PubsubProvider = PubsubProvider;
const usePubsubProvider = () => (0, react_1.useContext)(exports.PubsubInternal);
exports.usePubsubProvider = usePubsubProvider;
//# sourceMappingURL=PubsubProvider.js.map