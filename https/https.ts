import https from "https";
import fs from "fs";

console.log("START")

const name = "catalog";
const zipUrl = "https://github.com/GuillaumeFalourd/formulas-v3/archive/refs/tags/1.2.0.zip";

const file = fs.createWriteStream(name + ".zip");
const request = https.get(zipUrl, function(response) {
    response.pipe(file);
});

console.log("END")