/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const GET = (req, res) => {
	return res.status(200).json({
		success: true,
		message: "Index Works!!",
	});
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const POST = (req, res) => {
	const body = req.body;

	return res.status(200).json({
		success: true,
		data: {
			body,
		},
	});
};
