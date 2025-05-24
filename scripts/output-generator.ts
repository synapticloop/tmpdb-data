import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import {SVGTechnicalRenderer} from "./renderer/svg/technical/SVGTechnicalRenderer.ts";
import {PNGRenderer} from "./renderer/png/PNGRenderer.ts";
import {PDFDatasheetRenderer} from "./renderer/pdf/PDFDatasheetRenderer.ts";

import {SVGPencilRenderer} from "./renderer/svg/pencil/SVGPencilRenderer.ts";
import {SVGRenderer} from "./renderer/svg/SVGRenderer.ts";
import {SVGTechnicalComponentRenderer} from "./renderer/svg/technical/SVGTechnicalComponentRenderer.ts";
import {SVGTechnicalExplodedRenderer} from "./renderer/svg/technical/SVGTechnicalExplodedRenderer.ts";
import {SVGPencilAllRenderer} from "./renderer/svg/pencil/SVGPencilAllRenderer.ts";
import {SVGPencil45Renderer} from "./renderer/svg/pencil/SVGPencil45Renderer.ts";
import {ObjectMapper} from "json-object-mapper";
import deserialize = ObjectMapper.deserialize;
import {Component} from "./model/Component.ts";
import {SVGTechnicalGroupedRenderer} from "./renderer/svg/technical/SVGTechnicalGroupedRenderer.ts";
import {MDRenderer} from "./renderer/md/MDIndividualRenderer.ts";

let baseDir:string = './data/pencil';

if(process.argv[2]) {
	baseDir = process.argv[2];
}

// list the directories for the pencil data
const pencilDirectories:string[] = listDirectories(baseDir);

let numPencils: number = 0;
let numColours: number = 0;

for (const [dirIndex, pencilDirectory] of pencilDirectories.entries()) {
	const pencilDir: string = path.join(baseDir, pencilDirectory);

	const pencilFiles: string[] = listFiles(pencilDir);

	if (pencilFiles.length > 0) {
		console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`)

		for (const [index, pencilFile] of pencilFiles.entries()) {
			console.log(`    ${numPencils + 1}. ${pencilFile}`);

			const pencilFileFull = path.join(pencilDir, pencilFile);
			const pencilFileName = path.parse(path.join(pencilDir, pencilFile)).name;

			const pencilFileContents = JSON.parse(fs.readFileSync(pencilFileFull, "utf8"));
			const pencil: Pencil = deserialize(Pencil, pencilFileContents);

			pencil.postConstruct(pencil.getColours(), pencil.colourMap);

			let fileNumber = 1;

			// fileNumber = await renderSVGAndPNG(new SVGTechnicalRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName, fileNumber);
			// fileNumber = await renderSVGAndPNG(new SVGTechnicalGroupedRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-grouped", fileNumber);
			// fileNumber = await renderSVGAndPNG(new SVGTechnicalComponentRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-components", fileNumber);
			fileNumber = await renderSVGAndPNG(new SVGTechnicalExplodedRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-exploded", fileNumber);

			// fileNumber = await renderSVGAndPNG(new SVGPencilRenderer(pencil), -1, "pencil", pencilDirectory, pencilFileName, fileNumber);
			// fileNumber = await renderSVGAndPNG(new SVGPencilAllRenderer(pencil), -1, "pencil", pencilDirectory, pencilFileName + "-all-variants", fileNumber);
			// fileNumber = await renderSVGAndPNG(new SVGPencil45Renderer(pencil), -1, "pencil", pencilDirectory, pencilFileName + "-45", fileNumber);

			// now go through the colours
			for(let [ index, colourComponent ] of pencil.colourComponents.entries()) {
				const pencilColourOutputFileName: string = pencilFileName + "-colour-" + colourComponent.colourName;
				const pencilExplodedColourOutputFileName: string = pencilFileName + "-exploded-colour-" + colourComponent.colourName;

				// fileNumber = await renderSVGAndPNG(new SVGTechnicalRenderer(pencil), index, "technical", pencilDirectory, pencilColourOutputFileName, fileNumber);
				fileNumber = await renderSVGAndPNG(new SVGTechnicalExplodedRenderer(pencil), index, "technical", pencilDirectory, pencilExplodedColourOutputFileName, fileNumber);
				// fileNumber = await renderSVGAndPNG(new SVGPencil45Renderer(pencil), index, "pencil", pencilDirectory, pencilColourOutputFileName + "-45", fileNumber);
				// fileNumber = await renderSVGAndPNG(new SVGPencilRenderer(pencil), index, "pencil", pencilDirectory, pencilColourOutputFileName, fileNumber);
				// numColours++;
			}
			//
			// const pdfOutputDir: string = path.join("./output/pdf/datasheet/");
			// fs.mkdirSync(pdfOutputDir, { "recursive": true });
			// const outputPdfFie: string = path.join(pdfOutputDir, pencilDirectory + "-" + pencilFileName + ".pdf");
			// new PDFDatasheetRenderer(pencil, pencilDirectory, pencilFileName).render(outputPdfFie);
			// console.log(`       PDF: [${fileNumber}] (datasheet) ${pencilFile} -> ${outputPdfFie}`);
			// fileNumber++;

			numPencils++;
		}
	}
}

console.log(`\nGenerated ${numPencils} pencils with ${numColours} variants.`);

async function renderSVGAndPNG(svgRenderer: SVGRenderer,
												 offsetIndex: number,
												 outputDirectoryType: string,
												 pencilDirectory: string,
												 pencilFileName: string,
												 fileNumber: number): Promise<number> {
	const outputSVGFileTechnical = renderSVG(svgRenderer,
		offsetIndex,
		outputDirectoryType,
		pencilDirectory,
		pencilFileName,
		fileNumber);

	fileNumber++;

	await renderPNG(outputSVGFileTechnical,
		outputDirectoryType,
		pencilDirectory,
		pencilFileName,
		fileNumber)
		.then(r => {});

	fileNumber++;

	return(fileNumber);

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
