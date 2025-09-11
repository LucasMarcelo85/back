import type { NextFunction, Request, Response } from "express";
import Logger from "../utils/logger.js";

// Middleware para logar requisições HTTP
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();

	// Após a resposta ser enviada
	res.on("finish", () => {
		const responseTime = Date.now() - start;
		const { method, originalUrl, ip } = req;
		const { statusCode } = res;

		const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms - IP: ${ip}`;

		// Logs diferentes com base no status code
		if (statusCode >= 500) {
			Logger.error(message);
		} else if (statusCode >= 400) {
			Logger.warn(message);
		} else {
			Logger.http(message);
		}
	});

	next();
};
