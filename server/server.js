require("ts-node").register({
	transpileOnly: true,
});

// Load the configuration
const config = require("./config").default;
const log = require("@vmgware/js-logger").getInstance();
if (config.app.logLevel) {
	log.setLogLevel(config.app.logLevel);
}

// Override the require function to try/catch all require calls
const originalRequire = require;
// eslint-disable-next-line no-global-assign
require = function (module) {
	try {
		return originalRequire.apply(this, arguments);
	} catch (err) {
		log.error("server", "Error requiring module: " + module);
		log.error("server", err);
		process.exit(1);
	}
};

// Packages
const http = require("http");
const express = require("express");
const helmet = require("helmet");
const gracefulShutdown = require("http-graceful-shutdown");
const responseTime = require("response-time");
const fetch = require("node-fetch");
const { MeiliSearch } = require("meilisearch");

log.info("server", "Discuit Search backend service starting");

// Create the Express app
log.debug("server", "Creating Express app");
const app = express();
const port = config.app.port;
const url = config.app.url;

// Initialize a basic HTTP server
const server = http.createServer(app);

// Begin the server
(async () => {
	// Initialize the app
	log.debug("server", "Initializing app");
	app.use(express.json());
	app.disable("X-Powered-By");
	app.set("trust proxy", 1);
	app.use(express.static("public"));

	// Allow CORS
	log.info("server", "Allowing CORS for " + config.app.frontendUrl);
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", config.app.frontendUrl);
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Forwarded-For"
		);
		res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, PATCH, DELETE, OPTIONS"
		);
		res.header("Access-Control-Allow-Credentials", true);
		next();
	});

	// Global Middleware
	log.debug("server", "Setting global middleware");
	app.use(responseTime());
	app.use(function (req, res, next) {
		res.setHeader("X-Frame-Options", "SAMEORIGIN");
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.removeHeader("X-Powered-By");

		// Log should look like: 172.70.114.212 - "GET /api/v1/health HTTP/1.1" 200
		log.debug("server", `${req.ip} - "${req.method} ${req.url}"`);
		next();
	});

	// Attach middleware
	log.debug("server", "Registering middleware");
	app.use(helmet.hidePoweredBy());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Load & attach routes
	log.debug("server", "Loading routes");
	const Routes = require("./routes");
	Object.keys(Routes).forEach((route) => {
		app.use("/api/", Routes[route]);
	});

	// 404 middleware
	app.use(async (req, res) => {
		log.debug("server", `${req.ip} - "${req.method} ${req.url}" 404`);
		res.status(404).json({
			status: "error",
			code: 404,
			message: "The requested resource could not be found.",
			data: null,
		});
	});

	// 500 middleware
	app.use(async (error, req, res) => {
		await Exceptionless.submitException(error);
		return res.status(500).json({
			status: "error",
			code: 500,
			message: "An internal server error has occurred.",
			data: null,
		});
	});

	// Populate MeiliSearch index
	await populateMeiliSearch();

	// Setup cron jobs to periodically update the MeiliSearch index
	const cron = require("node-cron");
	cron.schedule("0 * * * *", async () => {
		await populateMeiliSearch();
	});

	// Start listening for requests
	server.listen(port, async () => {
		// Show the version number and the port that the app is running on
		log.info("server", `Discuit Search is serving at ${url}`);

		log.info("server", "Discuit Search backend service started at " + new Date());
	});
})();

async function populateMeiliSearch() {
	log.debug("server", "Populating MeiliSearch index");
	const communities = await fetch(
		"https://discuit.net/api/communities?set=all"
	).then(async (r) => {
		const res = await r.json();
		const comArr = res.map((c) => ({
			id: c.id,
			name: c.name,
			about: c.about,
			noMembers: c.noMembers,
		}));
		return comArr;
	});

	log.debug("server", "Communities fetched. Connecting to MeiliSearch");
	const client = new MeiliSearch({
		host: config.meiliSearch.host,
		apiKey: config.meiliSearch.apiKey,
	});

	const communitiesIndex = client.index("communities");

	// Check if the index exists
	if (!(await communitiesIndex.exists())) {
		log.debug("server", "Creating MeiliSearch index");
		await client.createIndex("communities");
	} else {
		log.debug("server", "MeiliSearch index already exists. Deleting all documents");
		await communitiesIndex.deleteAllDocuments();
	}

	log.debug("server", "Adding documents to MeiliSearch index");
	await communitiesIndex.addDocuments(communities);

	log.debug("server", "MeiliSearch index populated");
}

/**
 * Shutdown the application
 * @param {string} signal The signal that triggered this function to be called.
 * @returns {Promise<void>}
 */
async function shutdownFunction(signal) {
	log.info("server", "Shutdown requested");
	log.info("server", "Called signal: " + signal);

	// Close the server
	log.debug("server", "Closing server");
	app.close();
}

/**
 * Final function called before application exits
 * @returns {void}
 */
function finalFunction() {
	log.info("server", "Graceful shutdown successful!");
}

// Graceful shutdown
gracefulShutdown(app, {
	signals: "SIGINT SIGTERM",
	timeout: 30000, // timeout: 30 secs
	development: false, // not in dev mode
	forceExit: true, // triggers process.exit() at the end of shutdown process
	onShutdown: shutdownFunction, // shutdown function (async) - e.g. for cleanup DB, ...
	finally: finalFunction, // finally function (sync) - e.g. for logging
});

// Catch unhandled rejections
process.on("unhandledRejection", async (err) => {
	log.error("server", "Unhandled rejection: " + err);
	console.error(err);
});
process.on("uncaughtException", async (err) => {
	log.error("server", "Uncaught exception: " + err);
	console.error(err);
});
