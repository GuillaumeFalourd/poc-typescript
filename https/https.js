"use strict";
exports.__esModule = true;
var https_1 = require("https");
var fs_1 = require("fs");
console.log("START");
var name = "catalog";
var zipUrl = "https://github.com/GuillaumeFalourd/formulas-v3/archive/refs/tags/1.2.0.zip";
var file = fs_1["default"].createWriteStream(name + ".zip");
var request = https_1["default"].get(zipUrl, function (response) {
    response.pipe(file);
});
console.log("END");
