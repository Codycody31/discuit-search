const log = require("@vmgware/js-logger").getInstance();
const config = require("../config").default;

/**
 * Sends a generic error response with a 500 status code.
 *
 * Only returns the error object if the environment is set to development.
 * @param {Response} res The Express response object
 * @param {Error} error The error object
 * @param {string} moduleName The name of the module that the error occurred in
 * @returns {Response} The Express response object
 */
function genericInternalServerError(res, error, moduleName = "unknown") {
	// Get environment
	const env = config.app.env;

	// Log error to console
	if (error) {
		log.error(moduleName, error);
	}

	// Check if we are able to send a response
	if (res.headersSent) {
		return;
	}

	// Send response
	return res.status(500).json({
		status: "error",
		code: 500,
		message: "Something went wrong. But it's probably not your fault.",
		data: env === "development" ? error : null,
	});
}

/**
 * Sends a standard response with a 200 status code.
 * @param {Response} res The Express response object
 * @param {string} message The message to send
 * @param {object} data The data to send
 * @param {number} code The status code to send
 * @returns {Response} The Express response object
 */
function standardResponse(res, message, data, code = 200) {
	return res.status(code).json({
		status: code === 200 ? "success" : "error",
		code,
		message,
		data,
	});
}

module.exports = {
	genericInternalServerError,
	standardResponse,
};
