const { readFileSync, writeFileSync, createWriteStream } = require("fs");
const path = require("path");
const https = require("https");

const resolve_path = (fileName) => path.resolve(__dirname, fileName);
const save = (url, index) =>
  new Promise((resolve, reject) =>
    https
      .get(url, (res) => {
        res.pipe(
          createWriteStream(
            resolve_path(
              `../assets/${index + 1}-${
                url.split("?")[0].split("/")[
                  url.split("?")[0].split("/").length - 1
                ]
              }`
            )
          ).on("close", resolve)
        );
      })
      .on("error", reject)
  );

module.exports = {
  config: JSON.parse(
    readFileSync(resolve_path("config.json"), { encoding: "utf-8" })
  ),
  write: ({ latest_id, medias, latest_length }) => {
    return writeFileSync(
      resolve_path("config.json"),
      JSON.stringify(
        { latest_id, medias, latest_length: latest_length || "" },
        null,
        2
      ),
      {
        encoding: "utf-8",
      }
    );
  },
  download: async (medias) => {
    // ! FIX KEBALIK
    try {
      console.log(`** STARTING DOWNLOAD **`);
      for (let i = medias.length - 1; i >= 0; i--) {
        await save(medias[i], i);
        console.log(`SAVE COUNT ${i + 1}`);
      }
      console.log(`** SUCCESS DOWNLOAD **`);
      return;
    } catch (error) {
      console.log(`Oops.. Download Failed`);
      throw error;
    }
  },
};
