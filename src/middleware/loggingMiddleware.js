"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
var logger_js_1 = require("../utils/logger.js");
// Middleware para logar requisições HTTP
var httpLogger = function (req, res, next) {
    var start = Date.now();
    // Após a resposta ser enviada
    res.on("finish", function () {
        var responseTime = Date.now() - start;
        var method = req.method, originalUrl = req.originalUrl, ip = req.ip;
        var statusCode = res.statusCode;
        var message = "".concat(method, " ").concat(originalUrl, " ").concat(statusCode, " ").concat(responseTime, "ms - IP: ").concat(ip);
        // Logs diferentes com base no status code
        if (statusCode >= 500) {
            logger_js_1.default.error(message);
        }
        else if (statusCode >= 400) {
            logger_js_1.default.warn(message);
        }
        else {
            logger_js_1.default.http(message);
        }
    });
    next();
};
exports.httpLogger = httpLogger;
