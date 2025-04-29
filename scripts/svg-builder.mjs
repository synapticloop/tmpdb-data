import * as filesystem from './utils/filesystem.mjs'
import {listDirectories, listFiles} from "./utils/filesystem.mjs";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.mjs";
import fs from "fs";
import sharp from "sharp";
import Colour from "color";
import Color from "color";

const baseDir = './data/pencil';
// list the directories for the pencil data
const pencilDirectories = listDirectories(baseDir);

for (const pencilDirectory of pencilDirectories) {
	const pencilDir=path.join(baseDir, pencilDirectory);
	console.log(`Searching in directory '${pencilDir}'`);

	const pencilFiles = listFiles(pencilDir);
	console.log(pencilFiles);
	if (pencilFiles.length > 0) {
		console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`)
	}

	for (const [index, pencilFile] of pencilFiles.entries()) {
		console.log(`\t ${index + 1}. ${pencilFile}`);
		const pencilFileFull = path.join(pencilDir, pencilFile);
		const pencil = new Pencil(pencilFileFull);
		const outputFile = pencilFileFull + ".svg";

		fs.writeFileSync(outputFile, pencil.renderSvg(false));
		fs.writeFileSync(pencilFileFull + "-colour.svg", pencil.renderSvg(true));

		let options = {};

		sharp(outputFile, options)
				.png()
				.toFile(pencilFileFull + ".png")
				.then(() => {
					console.log('SVG successfully converted to PNG');
				})
				.catch(error => {
					console.error('Error converting SVG to PNG:', error);
				});

		sharp(pencilFileFull + "-colour.svg", options)
				.png()
				.toFile(pencilFileFull + "-colour.svg.png")
				.then(() => {
					console.log('SVG successfully converted to PNG');
				})
				.catch(error => {
					console.error('Error converting SVG to PNG:', error);
				});

	}
}