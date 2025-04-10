const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/followers", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://twitter.com/IMBXio", { waitUntil: "networkidle2" });

    const followers = await page.evaluate(() => {
      const el = document.querySelector('a[href$="/followers"] span');
      return el ? el.innerText : null;
    });

    await browser.close();

    if (followers) {
      res.json({ followers });
    } else {
      res.status(404).json({ error: "팔로워 수를 찾을 수 없습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
