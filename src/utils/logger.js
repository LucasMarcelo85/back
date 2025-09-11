"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
// Níveis de log configuráveis
var levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Determina o nível baseado no ambiente
var level = function () {
    var env = process.env.NODE_ENV || "development";
    var isDevelopment = env === "development";
    return isDevelopment ? "debug" : process.env.LOG_LEVEL || "info";
};
// Cores para cada nível
var colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
// Configuração das cores
winston_1.default.addColors(colors);
// Formato do log
var format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message); }));
// Transportes (onde os logs serão salvos/exibidos)
var transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
    new winston_1.default.transports.File({ filename: "logs/all.log" }),
];
// Criação do logger
var Logger = winston_1.default.createLogger({
    level: level(),
    levels: levels,
    format: format,
    transports: transports,
});
exports.default = Logger;
