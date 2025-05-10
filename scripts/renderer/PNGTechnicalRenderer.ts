import {SVGRenderer} from "./SVGRenderer.ts";
import sharp from "sharp";
import {Pencil} from "../model/Pencil.ts";

export class PNGTechnicalRenderer {
	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(inputSvgFile: any, outputFilePath: any): void {
		let options = {};
		sharp(inputSvgFile, options)
				.png()
				.toFile(outputFilePath)
				.then(() => {
				})
				.catch(error => {
					console.error(`Error converting SVG to PNG \t'${outputFilePath}'`, error);
				});

	}
}