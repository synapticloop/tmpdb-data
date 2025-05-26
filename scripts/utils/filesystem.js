"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDirectories = listDirectories;
exports.listFiles = listFiles;
var fs_1 = require("fs");
var url_1 = require("url");
var path_1 = require("path");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
/**
 * List all directories in the `directoryPath` directory
 *
 * @param {string} directoryPath The directory path
 * @returns {string[]} The list of directories in the directory path
 */
function listDirectories(directoryPath) {
    return fs_1.default.readdirSync(directoryPath, { withFileTypes: true })
        .filter(function (directoryEntry) { return directoryEntry.isDirectory(); })
        .map(function (directoryEntry) { return directoryEntry.name; });
}
function listFiles(directoryPath) {
    return fs_1.default.readdirSync(directoryPath, { withFileTypes: true })
        .filter(function (fileEntry) {
        return (fileEntry.isFile() && fileEntry.name.endsWith(".json"));
    })
        .map(function (fileEntry) { return fileEntry.name; });
}
