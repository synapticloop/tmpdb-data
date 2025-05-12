import * as filesystem from './utils/filesystem.ts'
import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import {SVGTechnicalRenderer} from "./renderer/SVGTechnicalRenderer.ts";
import {PNGRenderer} from "./renderer/PNGRenderer.ts";
import {PDFDatasheetRenderer} from "./renderer/PDFDatasheetRenderer.ts";

import {SVGPencilRenderer} from "./renderer/SVGPencilRenderer.ts";
import {SVGRenderer} from "./renderer/SVGRenderer.ts";
import {SVGTechnicalComponentRenderer} from "./renderer/SVGTechnicalComponentRenderer.ts";

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

			const outputSVGFileTechnical = renderSVG(new SVGTechnicalRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName, fileNumber);
			fileNumber++;

			await renderPNG(outputSVGFileTechnical, "technical", pencilDirectory, pencilFileName, fileNumber)
				.then(r => {});
			fileNumber++;

			const outputSVGFilePencil = renderSVG(new SVGPencilRenderer(pencil), -1, "pencil", pencilDirectory, pencilFileName, fileNumber);
			fileNumber++;

			await renderPNG(outputSVGFilePencil, "pencil", pencilDirectory, pencilFileName, fileNumber)
				.then(r => {});
			fileNumber++;

			// now go through the colours
			for(let [ index, colourComponent ] of pencil.colourComponents.entries()) {
				const pencilOutputFileName = pencilFileName + "-colour-" + colourComponent;
				const outputColourTechnicalSvg = renderSVG(new SVGTechnicalRenderer(pencil), index, "technical", pencilDirectory, pencilOutputFileName, fileNumber);
				fileNumber++;

				await renderPNG(outputColourTechnicalSvg, "technical", pencilDirectory, pencilOutputFileName, fileNumber)
					.then(r => {});
				fileNumber++;

				const outputColourPencilSvg = renderSVG(new SVGPencilRenderer(pencil), index, "pencil", pencilDirectory, pencilOutputFileName, fileNumber);
				fileNumber++;

				await renderPNG(outputColourPencilSvg, "pencil", pencilDirectory, pencilOutputFileName, fileNumber)
					.then(r => {});
				fileNumber++;
			}

			// now we are going to render each of the components - in white of course :)
			for(const [ index, component ] of pencil.components.entries()) {
				const componentFileName = pencilFileName + "-component-" + index + "-" + component.type;
				const outputSVGFileTechnicalComponent = renderSVG(
					new SVGTechnicalComponentRenderer(pencil), index,
					"technical",
					pencilDirectory,
					componentFileName,
					fileNumber);
				fileNumber++;

				// now PNG it
				await renderPNG(outputSVGFileTechnicalComponent, "technical", pencilDirectory, componentFileName, fileNumber)
					.then(r => {});
				fileNumber++;
			}

			const pdfOutputDir: string = path.join("./output/pdf/datasheet/");
			fs.mkdirSync(pdfOutputDir, { "recursive": true });
			const outputPdfFie: string = path.join(pdfOutputDir, pencilDirectory + "-" + pencilFileName + ".pdf");
			new PDFDatasheetRenderer(pencil, pencilDirectory, pencilFileName).render(outputPdfFie);
			console.log(`       PDF: [${fileNumber}] (datasheet) ${pencilFile} -> ${outputPdfFie}`);
			fileNumber++;
		}
	}
}

function renderSVG(svgRenderer: SVGRenderer,
									 offsetIndex: number,
									 outputDirectoryType: string,
									 pencilDirectory: string,
									 pencilFileName: string,
									 fileNumber: number): string {
	const svgOutputDir = path.join("./output/svg/", outputDirectoryType, pencilDirectory);
	fs.mkdirSync(svgOutputDir, { "recursive": true });
	const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");
	const svgString = svgRenderer.render(offsetIndex);
	fs.writeFileSync(outputSvgFile, svgString);
	console.log(`       SVG: [${fileNumber}] (${outputDirectoryType}) ${outputSvgFile}`);

	return(outputSvgFile);
}

async function renderPNG(inputSVGFile:string,
												 outputDirectoryType: string,
												 pencilDirectory: string,
												 pencilFileName: string,
												 fileNumber: number): Promise<void> {
	const pngOutputDir = path.join("./output/png/", outputDirectoryType, pencilDirectory);
	fs.mkdirSync(pngOutputDir, { "recursive": true });
	const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");

	await new PNGRenderer().render(inputSVGFile, outputPngFile)
		.then(() => {})
		.catch(error => {
			console.error(error);
		});
	console.log(`       PNG: [${fileNumber}] (${outputDirectoryType}) ${outputPngFile}`);

}
