const fs = require("fs");
const path = require("path");
const log = require("@vmgware/js-logger").getInstance();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *      description: JWT authorization header using the Bearer scheme.
 */

// Function to log routes for a given router
function logRoutes(router, routerName) {
	router.stack.forEach((route) => {
		if (route.route) {
			let methods = route.route.methods
				? Object.keys(route.route.methods).join(", ")
				: "ALL";

			if (routerName.includes("/")) {
				// Split routerName into parts and join them with a period
				// This is to log the route in the correct format
				const routerNameParts = routerName.split("/");
				const routerNameFormatted = routerNameParts.join(".");

				log.debug(
					`routes.${routerNameFormatted}`,
					"Registered route: " + route.route.path + " (" + methods + ")"
				);
			} else {
				log.debug(
					`routes.${routerName}`,
					"Registered route: " + route.route.path + " (" + methods + ")"
				);
			}
		}
	});
}

function getAllJSFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			// Recursively search in subdirectories
			fileList = getAllJSFiles(filePath, fileList);
		} else if (file.endsWith(".js") && filePath !== __filename) {
			fileList.push(filePath.replace(__dirname + "/", ""));
		}
	});

	return fileList;
}

const routeFiles = getAllJSFiles(__dirname);

// Create an object to store all routes
const routes = {};
let issue = false;

routeFiles.forEach((file) => {
	// If the file is this file, skip it
	// This is just a safety check
	if (file === path.basename(__filename)) {
		return;
	}

	try {
		const route = require(`./${file}`);
		const routeName = file.replace(".js", "");
		logRoutes(route, routeName);
		routes[`${routeName}Routes`] = route;
	} catch (err) {
		issue = true;
		if (err.code === "MODULE_NOT_FOUND") {
			log.error("routes", `Could not find route file ${file}`);
		}
		if (err instanceof SyntaxError) {
			log.error(
				"routes",
				`Syntax error in route file ${file}: ${err.message}: ${err.stack}`
			);
		}
		if (err instanceof TypeError) {
			log.error(
				"routes",
				`Type error in route file ${file}: ${err.message}: ${err.stack}`
			);
		} else {
			log.error(
				"routes",
				`Error loading route file ${file}: ${err.message}: ${err.stack}`
			);
		}
	}
});

if (issue) {
	log.warn("routes", "There were issues loading some routes");
}

// Export all routes
module.exports = routes;
