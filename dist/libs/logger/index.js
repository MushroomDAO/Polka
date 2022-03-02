"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOGGING_ENABLED = false;
const LOGBRO = (...message) => {
    if (!LOGGING_ENABLED)
        return;
    console.log(message);
};
exports.default = LOGBRO;
//# sourceMappingURL=index.js.map