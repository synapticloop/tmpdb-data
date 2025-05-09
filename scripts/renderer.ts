import * as filesystem from './utils/filesystem.ts'
import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import {SVGRenderer} from "./renderer/SVGRenderer.ts";
import {PNGTechnicalRenderer} from "./renderer/PNGTechnicalRenderer.ts";
import {PDFDatasheetRenderer} from "./renderer/PDFDatasheetRenderer.ts";

const baseDir:string = './data/pencil';
// list the directories for the pencil data
const pencilDirectories:string[] = listDirectories(baseDir);

for (const pencilDirectory of pencilDirectories) {
	const pencilDir=path.join(baseDir, pencilDirectory);

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
			const svgOutputDir = path.join("./output/svg/technical/", pencilDirectory);
			fs.mkdirSync(svgOutputDir, { "recursive": true });
			const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");
			const svgString = new SVGRenderer(pencil).render(-1);
			fs.writeFileSync(outputSvgFile, svgString);
			console.log(`       SVG: [${fileNumber}] (outline: white) ${pencilFile} -> ${outputSvgFile}`);
			fileNumber++;

			const pngOutputDir = path.join("./output/png/technical/", pencilDirectory);
			fs.mkdirSync(pngOutputDir, { "recursive": true });
			const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");
			new PNGTechnicalRenderer(pencil).render(outputSvgFile, outputPngFile);
			console.log(`       PNG: [${fileNumber}] (outline: white) ${pencilFile} -> ${outputSvgFile}`);
			fileNumber++;

			// now go through the colours
			for(let [ index, colourComponent ] of pencil.colourComponents.entries()) {
				const colourOutputSvgFile = path.join(svgOutputDir, pencilFileName + "-colour-" + colourComponent + ".svg");
				const svgString = new SVGRenderer(pencil).render(index);
				fs.writeFileSync(colourOutputSvgFile, svgString);
				console.log(`       SVG: [${fileNumber}] (colour: ${colourComponent}) ${pencilFile} -> ${colourOutputSvgFile}`);
				fileNumber++;

				const colourOutputPngFile = path.join(pngOutputDir, pencilFileName + "-colour-" + colourComponent + ".png");
				new PNGTechnicalRenderer(pencil).render(colourOutputSvgFile, colourOutputPngFile);
				console.log(`       PNG: [${fileNumber}] (colour: ${colourComponent}) ${pencilFile} -> ${colourOutputPngFile}`);
				fileNumber++;
			}

			const pdfOutputDir: string = path.join("./output/pdf/datasheet/");
			fs.mkdirSync(pdfOutputDir, { "recursive": true });
			const outputPdfFie: string = path.join(pdfOutputDir, pencilFileName + ".pdf");
			new PDFDatasheetRenderer(pencil).render(outputPdfFie);


		}
	}
}