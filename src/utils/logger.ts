import winston from "winston";

// Níveis de log configuráveis
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Determina o nível baseado no ambiente
const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : process.env.LOG_LEVEL || "info";
};

// Cores para cada nível
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

// Configuração das cores
winston.addColors(colors);

// Formato do log
const format = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`,
	),
);

// Transportes (onde os logs serão salvos/exibidos)
const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

// Criação do logger
const Logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

export default Logger;
