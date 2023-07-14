/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const GET = (req, res) => {
	const { name } = req.params;

	return res.status(200).json({
		success: true,
		data: {
			name,
		},
	});
};
