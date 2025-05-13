import sharp from "sharp";

export class PNGRenderer {

	constructor() {
	}

	async render(inputSvgFile: string, outputFilePath: string): Promise<void> {
		let options = { density: 144, resolutionUnit: "inch" };
		await sharp(inputSvgFile, options)
				.png()
				.toFile(outputFilePath)
				.then(() => {
				})
				.catch(error => {
					console.error(`Error converting SVG input '${inputSvgFile}' to PNG '${outputFilePath}'`, error);
				});
	}
}