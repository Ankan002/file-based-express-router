import express from "express";
import fs from "node:fs";

/**
 *
 * @param {string} fileUrl
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response | false>}
 */
async function handleRegularRoutes(fileUrl, req, res, staticPathChecked) {
	try {
		const module = await import(fileUrl);

		const httpVerb = req.method;
		const data = module[httpVerb](req, res);

		return data;
	} catch (error) {
		if (staticPathChecked) {
			console.log(error);
			res.statusCode = 400;
		}
		return false;
	}
}

async function handleDynamicRoutes(folder) {
	try {
		const files = await fs.promises.readdir(folder);

		const dynamicFileName = files.find((fileName) => {
			return fileName.match(/\[[a-zA-Z0-9\._]+\]/);
		});

		return {
			dynamicFileName,
			paramName: dynamicFileName.replace("[", "").replace("].js", ""),
		};
	} catch (e) {
		console.log(e);
		return null;
	}
}

const app = express();
const ROOT_FOLDER = "./api/";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/*", async (req, res) => {
	let fileUrl = (ROOT_FOLDER + req.url).replace("//", "/");
	let staticPathChecked = false;
	let isFile = fs.existsSync(fileUrl + ".js");

	if (!isFile) {
		fileUrl += "/index.js";
	} else {
		fileUrl += ".js";
	}

	let result = await handleRegularRoutes(
		fileUrl,
		req,
		res,
		staticPathChecked
	);

	staticPathChecked = true;

	if (result === false) {
		const pathArray = (ROOT_FOLDER + req.url).replace("//", "/").split("/");
		const param = pathArray.pop();
		const folderPath = pathArray.join("/");

		const dynamicRoute = await handleDynamicRoutes(folderPath);

		if (!dynamicRoute) {
			return res.status(404).json({
				success: false,
				error: "Route Not Found!!",
			});
		}

		req.params = {
			...req.params,
			[dynamicRoute.paramName]: param,
		};

		const result = await handleRegularRoutes(
			`${folderPath}/${dynamicRoute.dynamicFileName}`,
			req,
			res,
			staticPathChecked
		);

		if (result === false) {
			return res.status(404).json({
				success: false,
				error: "Route Not Found!!",
			});
		} else {
			return result;
		}
	} else {
		return result;
	}
});

app.listen(3000, () => console.log(`App is running at 3000`));
