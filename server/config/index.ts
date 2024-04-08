import * as dotenv from "dotenv";

dotenv.config();

/**
 * Application related configuration
 */
interface AppConfig {
	/**
	 * Port number for the application server
	 */
	port: number;
	/**
	 * Environment in which the app is running, e.g., 'development', 'production'
	 */
	env: string;
	/**
	 * Secret key for session handling
	 */
	sessionSecret?: string;
	/**
	 * Base URL of the application
	 */
	url: string;
	/**
	 * Base URL of the frontend application
	 */
	frontendUrl: string;
	/**
	 * Log level for the application
	 */
	logLevel: string;
}

interface MeiliSearchConfig {
	/**
	 * Host of the MeiliSearch server
	 */
	host: string;
	/**
	 * API key for the MeiliSearch server
	 */
	apiKey: string;
}

class Config {
	/**
	 * Application configuration
	 */
	app: AppConfig;

	/**
	 * MeiliSearch configuration
	 */
	meiliSearch: MeiliSearchConfig;

	/**
	 * @constructor Config
	 * @description The constructor for the Config class.
	 */
	constructor() {
		this.app = {
			port: parseInt(process.env.APP_PORT || "5000"),
			env: process.env.APP_ENV || "development",
			url:
				process.env.APP_URL || `http://localhost:${process.env.APP_PORT || "5000"}`,
			frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
			logLevel: process.env.APP_LOG_LEVEL || "info",
		};

		this.meiliSearch = {
			host: process.env.MEILI_SEARCH_HOST || "http://localhost:7700",
			apiKey: process.env.MEILI_SEARCH_API_KEY || "",
		};
	}
}

export default new Config();
