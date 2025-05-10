import * as filesystem from './utils/filesystem.ts'
import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import sharp from "sharp";
import {SVGRenderer} from "./renderer/SVGRenderer.ts";
import {PNGRenderer} from "./renderer/PNGRenderer.ts";

const baseDir:string = './data/pencil';
// list the directories for the pencil data
const pencilDirectories:string[] = listDirectories(baseDir);

for (const pencilDirectory of pencilDirectories) {
	const pencilDir=path.join(baseDir, pencilDirectory);
	console.log(`Searching in directory '${pencilDir}'`);

	const pencilFiles = listFiles(pencilDir);

	if (pencilFiles.length > 0) {
		console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`)
		for (const [index, pencilFile] of pencilFiles.entries()) {
			console.log(`    ${index + 1}. ${pencilFile}`);

			const pencilFileFull = path.join(pencilDir, pencilFile);
			const pencilFileName = path.parse(path.join(pencilDir, pencilFile)).name;

			const pencil: Pencil = new Pencil(fs.readFileSync(pencilFileFull, "utf8"));

			let fileNumber = 1;

			// now for the SVG files
			const svgOutputDir = path.join("./output/svg/pencil/", pencilDirectory);
			fs.mkdirSync(svgOutputDir, { "recursive": true });
			const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");
			const svgString = new SVGRenderer(pencil).generateSVG(-1);
			fs.writeFileSync(outputSvgFile, svgString);
			console.log(`       SVG: [${fileNumber}] (outline: white) ${pencilFile} -> ${outputSvgFile}`);
			fileNumber++;

			const pngOutputDir = path.join("./output/png/pencil/", pencilDirectory);
			fs.mkdirSync(pngOutputDir, { "recursive": true });
			const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");
			new PNGRenderer(pencil).renderToPNGFile(outputSvgFile, outputPngFile);
			console.log(`       PNG: [${fileNumber}] (outline: white) ${pencilFile} -> ${outputSvgFile}`);
			fileNumber++;

			// now go through the colours
			for(let [ index, colourComponent ] of pencil.colourComponents.entries()) {
				const colourOutputSvgFile = path.join(svgOutputDir, pencilFileName + "-colour-" + colourComponent + ".svg");
				const svgString = new SVGRenderer(pencil).generateSVG(index);
				fs.writeFileSync(colourOutputSvgFile, svgString);
				console.log(`       SVG: [${fileNumber}] (colour: ${colourComponent}) ${pencilFile} -> ${colourOutputSvgFile}`);
				fileNumber++;

				const colourOutputPngFile = path.join(pngOutputDir, pencilFileName + "-colour-" + colourComponent + ".png");
				new PNGRenderer(pencil).renderToPNGFile(colourOutputSvgFile, colourOutputPngFile);
				console.log(`       PNG: [${fileNumber}] (colour: ${colourComponent}) ${pencilFile} -> ${colourOutputPngFile}`);
				fileNumber++;
			}

			// now write out some PNG files
			// const pngOutputDir = path.join("./output/png/pencil/", pencilDirectory);
			// const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");
			// new PNGRenderer(pencil).generatePNG()
			// 		.then((buffer: Buffer) => {
			// 			console.log(buffer.toString());
			// 			console.log(`       PNG: [1] (outline: white) ${pencilFile} -> ${outputPngFile}`);
			// 			fs.writeFileSync(outputPngFile, buffer);
			// 		})
			// 		.catch(error => {
			// 			console.error(error);
			// 		});


			// writeSvgToPng(outputSvgFile, path.join(pngOutputDir, pencilFileName + ".png"))

			// const pngOutputDir = path.join("./output/png/pencil/", pencilDirectory);
			// fs.mkdirSync(pngOutputDir, { "recursive": true });

		}
	}

	for (const [index, pencilFile] of pencilFiles.entries()) {
		console.log(`\t ${index + 1}. ${pencilFile}`);

		const pngOutputDir = path.join("./output/images/pencil/", pencilDirectory);
		fs.mkdirSync(pngOutputDir, { "recursive": true });

		const svgOutputDir = path.join("./output/vectors/pencil/", pencilDirectory);
		fs.mkdirSync(svgOutputDir, { "recursive": true });

		const pencilFileFull = path.join(pencilDir, pencilFile);
		const pencilFileName = path.parse(path.join(pencilDir, pencilFile)).name;


		const pencil: Pencil = new Pencil(fs.readFileSync(pencilFileFull, "utf8"));


		const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");

		fs.writeFileSync(outputSvgFile, pencil.renderSvg(false, 0, ""));
		writeSvgToPng(outputSvgFile, path.join(pngOutputDir, pencilFileName + ".png"))

		let colourComponent = pencil.colourComponent;
		for(const [index, colour] of pencil.colourComponents.entries()) {
			const outputSvgColourFile = path.join(svgOutputDir, pencilFileName + "-colour-" + colour + ".svg");
			fs.writeFileSync(outputSvgColourFile, pencil.renderSvg(true, index, colourComponent));
			writeSvgToPng(outputSvgColourFile, path.join(pngOutputDir, pencilFileName + "-colour-" + colour + ".png"))
		}
	}

	/**
	 * Convert an SVG to a Png image and write it to a file
	 *
	 * @param inputSvg  The input file location of the SVG
	 * @param outputPng The output file location to write the PNG
	 */
	function writeSvgToPng(inputSvg, outputPng) {
		// options for things - just in case...
		let options = {};
		sharp(inputSvg, options)
			.png()
			.toFile(outputPng)
			.then(() => {
				console.log(`Successfully converted SVG \n\t'${inputSvg}'\n  to PNG \n\t'${outputPng}'`);
			})
			.catch(error => {
				console.error(`Error converting SVG \n\t'${inputSvg}'\n  to PNG \n\t'${outputPng}'`, error);
			});
	}
}