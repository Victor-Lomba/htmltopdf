const express = require("express");
const puppeteer = require("puppeteer");

const chromeOptions = {
	headless: true,
	defaultViewport: null,
	args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
};

const app = express();

app.use(express.json());
app.post("/", async (req, res) => {
	if (!req.body) return res.status(400).end({ error: "bad request" });
	if (!req.body.html) return res.status(400).end({ error: "bad request" });

	const browser = await puppeteer.launch(chromeOptions);
	const page = await browser.newPage();
	page.setContent(req.body.html);
	const pdf = await page.pdf();
	await page.close();

	res.setHeader("Content-disposition", 'attachment; filename="curriculo.pdf');
	res.setHeader("Content-Type", "application/pdf");
	res.status(200).end(pdf);
});

app.listen(process.env.PORT || 1337, () => {
	console.log("listening on port: " + (process.env.PORT || 1337));
});
