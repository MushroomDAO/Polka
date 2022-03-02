"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const pubsub_1 = __importDefault(require("./pubsub"));
class Pubsub {
    constructor() {
        // constructor(frequency: string = "polka") {
        // 	this.subscribe(frequency);
        // }
        this.frequencies = {};
    }
    subscribe(frequency) {
        (0, logger_1.default)("[Subscribing] ", frequency);
        const swarm = (0, pubsub_1.default)(frequency);
        if (!this.frequencies[frequency]) {
            this.frequencies[frequency] = swarm;
        }
        return swarm;
    }
    publish(frequency, message) {
        (0, logger_1.default)("[Publishing] -> ", frequency, message);
        const swarm = this.frequencies[frequency];
        if (!swarm) {
            (0, logger_1.default)("Could not find swarm for that frequency");
            return;
        }
        const data = {
            content: message,
            type: "string",
            userId: swarm.id,
            timestamp: +new Date().getTime(),
        };
        swarm.publish(data);
        return data;
    }
}
exports.default = Pubsub;
//# sourceMappingURL=index.js.map