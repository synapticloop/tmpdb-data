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
import {MDBrandGroupRenderer} from "./renderer/md/MDBrandGroupRenderer.ts";

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

	const brandPencilMap: Map<string, Pencil[]> = new Map<string, Pencil[]>();
	const brandPencilFileMap: Map<string, string[]> = new Map<string, string[]>();
	const brandPencilDirectoryMap: Map<string, string[]> = new Map<string, string[]>();

	if (pencilFiles.length > 0) {
		console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`)

		for (const [index, pencilFile] of pencilFiles.entries()) {
			console.log(`    ${numPencils + 1}. ${pencilFile}`);

			const pencilFileFull: string = path.join(pencilDir, pencilFile);
			const pencilFileName: string = path.parse(path.join(pencilDir, pencilFile)).name;

			const pencilFileContents = JSON.parse(fs.readFileSync(pencilFileFull, "utf8"));
			const pencil: Pencil = deserialize(Pencil, pencilFileContents);

			pencil.postConstruct(pencil.getColours(), pencil.colourMap);
			if(brandPencilMap.has(pencilDirectory)) {
				brandPencilMap.get(pencilDirectory).push(pencil);
				brandPencilFileMap.get(pencilDirectory).push(pencilFileName);
				brandPencilDirectoryMap.get(pencilDirectory).push(pencilDirectory);
			} else {
				brandPencilMap.set(pencilDirectory, [ pencil ]);
				brandPencilFileMap.set(pencilDirectory, [ pencilFileName ]);
				brandPencilDirectoryMap.set(pencilDirectory, [ pencilDirectory ]);
			}

			let fileNumber = 1;

			const mdIndividualDirectory: string = path.join("./documentation/pencil/", pencilDirectory);
			fs.mkdirSync(mdIndividualDirectory, { "recursive": true });
			fs.writeFileSync(mdIndividualDirectory + "/" + pencilFileName + ".md", new MDRenderer(pencil, pencilFileName).render());
			console.log(`        MD: [${fileNumber}] (individual) ${mdIndividualDirectory + pencilFileName + ".md"}`);
			fileNumber++;

			fileNumber = await renderSVGAndPNG(new SVGTechnicalGroupedRenderer(pencil), -1, "", pencilDirectory, pencilFileName + "-grouped", fileNumber);

			numPencils++;
		}

		for(const pencilKey of brandPencilMap.keys()) {
			const mdIndividualDirectory: string = path.join("./documentation/pencil/");
			fs.mkdirSync(mdIndividualDirectory, { "recursive": true });
			fs.writeFileSync(mdIndividualDirectory + "/" + pencilKey + ".md",
				new MDBrandGroupRenderer(
					brandPencilMap.get(pencilKey),
					brandPencilFileMap.get(pencilKey),
					brandPencilDirectoryMap.get(pencilKey)
				).render());
		}
	}
}

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
	const svgOutputDir = path.join("./documentation/pencil/", outputDirectoryType, pencilDirectory);
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
	const pngOutputDir = path.join("./documentation/pencil/", outputDirectoryType, pencilDirectory);
	fs.mkdirSync(pngOutputDir, { "recursive": true });
	const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");

	await new PNGRenderer().render(inputSVGFile, outputPngFile)
		.then(() => {})
		.catch(error => {
			console.error(error);
		});

	console.log(`       PNG: [${fileNumber}] (${outputDirectoryType}) ${outputPngFile}`);

}
