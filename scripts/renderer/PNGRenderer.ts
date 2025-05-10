import {SVGRenderer} from "./SVGRenderer.ts";
import sharp from "sharp";
import {Pencil} from "../model/Pencil.ts";

export class PNGRenderer {
	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}
	/**
	 * Generate a PNG Buffer from the passed in Pencil, in effect this will
	 * generate the SVG information as a string and then parse this to a PNG
	 * which will then return the buffer.
	 *
	 * @return {string} The PNG as a String
	 */
	generatePNG():Promise<Buffer> {
		const svgString = new SVGRenderer(this.pencil)
			.generateSVG(-1);

		let options = {};

		return(sharp(svgString, options)
				.png()
				.toBuffer());
	}

	renderToPNGFile(inputSvgFile: any, outputFilePath: any): void {
		let options = {};
		sharp(inputSvgFile, options)
				.png()
				.toFile(outputFilePath)
				.then(() => {
					console.log(`Successfully converted SVG to PNG \t'${outputFilePath}'`);
				})
				.catch(error => {
					console.error(`Error converting SVG to PNG \t'${outputFilePath}'`, error);
				});

	}
}