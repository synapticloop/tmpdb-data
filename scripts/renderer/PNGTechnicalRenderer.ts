import sharp from "sharp";
import {Pencil} from "../model/Pencil.ts";

export class PNGTechnicalRenderer {
	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(inputSvgFile: string, outputFilePath: string): void {
		let options = {};
		sharp(inputSvgFile, options)
				.png()
				.toFile(outputFilePath)
				.then(() => {
				})
				.catch(error => {
					console.error(`Error converting SVG input '${inputSvgFile}' to PNG '${outputFilePath}'`, error);
				});

	}
}