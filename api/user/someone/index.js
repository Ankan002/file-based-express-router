/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const GET = (req, res) => {
	return res.status(200).json({
		success: true,
		message: "Index user some not dynamic Works!!",
	});
};