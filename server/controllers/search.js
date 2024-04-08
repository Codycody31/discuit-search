// Helpers/utilities
const config = require("../config").default;
const { MeiliSearch } = require("meilisearch");

const allowedIndexes = ["communities"];

async function search(req, res) {
	try {
		const query = req.query.query;
		const index = req.query.index;

		const client = new MeiliSearch({
			host: config.meiliSearch.host,
			apiKey: config.meiliSearch.apiKey,
		});

		if (!query) {
			return res.status(400).json({
				status: "error",
				message: "Query is required",
				code: 400,
				data: {},
			});
		}
		if (!index) {
			return res.status(400).json({
				status: "error",
				message: "Index is required",
				code: 400,
				data: {},
			});
		}
		if (!allowedIndexes.includes(index)) {
			return res.status(400).json({
				status: "error",
				message: "Index not allowed",
				code: 400,
				data: {},
			});
		}

		const searchIndex = client.index(index);

		const search = await searchIndex.search(query);

		// Return the healthcheck
		res.status(200).json({
			status: "success",
			message: `Searching for ${query} in ${index}`,
			code: 200,
			data: search,
		});
	} catch (error) {
		genericInternalServerError(res, error, "search.search");
	}
}

// Export the functions
module.exports = {
	search,
};
