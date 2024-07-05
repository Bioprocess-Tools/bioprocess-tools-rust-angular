const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/about", changefreq: "monthly", priority: 0.7 },
  // add more routes as needed
];

const sitemap = new SitemapStream({ hostname: "https://bioprocess-tools.app" });

streamToPromise(sitemap)
  .then((sitemapData) => {
    fs.writeFileSync(
      path.resolve(__dirname, "dist/om-buffer-expert/sitemap.xml"),
      sitemapData.toString()
    );
    console.log("Sitemap generated!");
  })
  .catch(console.error);

links.forEach((link) => sitemap.write(link));
sitemap.end();
