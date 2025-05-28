import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import {PNGRenderer} from "./renderer/png/PNGRenderer.ts";
import {SVGRenderer} from "./renderer/svg/SVGRenderer.ts";
import {ObjectMapper} from "json-object-mapper";
import deserialize = ObjectMapper.deserialize;
import {SVGExampleRenderer} from "./renderer/svg/example/SVGExampleRenderer.ts";

let baseDir:string = './meta/examples';

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

			const exampleDirectory: string = path.join("./documentation/examples/", pencilDirectory);
			fs.mkdirSync(exampleDirectory, { "recursive": true });

			fileNumber = await renderSVGAndPNG(new SVGExampleRenderer(pencil), -1, "", pencilDirectory, pencilFileName, fileNumber);

			fileNumber++;


			numPencils++;
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
	const svgOutputDir = path.join("./documentation/examples/", outputDirectoryType, pencilDirectory);
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
	const pngOutputDir = path.join("./documentation/examples/", outputDirectoryType, pencilDirectory);
	fs.mkdirSync(pngOutputDir, { "recursive": true });
	const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");

	await new PNGRenderer().render(inputSVGFile, outputPngFile)
		.then(() => {})
		.catch(error => {
			console.error(error);
		});

	console.log(`       PNG: [${fileNumber}] (${outputDirectoryType}) ${outputPngFile}`);

}
