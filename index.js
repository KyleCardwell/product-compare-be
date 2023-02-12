import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import axios from "axios";

const server = express();

const PORT = process.env.PORT || 9000;

server.use(express.json());
server.use(cors());

server.get("/api/hello", (req, res) => {
	res.json({ message: "api is working" });
});

server.post("/product", async (req, res) => {
  
  const knife = {};
  const knifeArr = [];

	await axios(req.body.url)
		.then((res) => {
			const html = res.data;
			const $ = cheerio.load(html);


			$("#item-specifications", html)
				.contents()
				.each(function () {
					$(this)
						.find("li")
						.each(function () {
							let key = $(this).find("strong").text();
							key = key.replace(":", "");
							let val = $(this).find("span").text();

							knife[key] = val;
							knifeArr.push([key, val]);
						});
				});
			console.log(knife);
			console.log(knifeArr);

		})
		.catch((err) => console.log(err));

    res.json({ product: knifeArr, productObj: knife, message: "This is finally working" });
});

server.use("*", (req, res) => {
	res.send("<h1>Sup!</h1>");
});

server.use((err, req, res, next) => { // eslint-disable-line
	// eslint-disable-line
	res.status(500).json({
		message: err.message,
		stack: err.stack,
	});
});

server.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});