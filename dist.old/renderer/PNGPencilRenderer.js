import sharp from "sharp";
export class PNGTechnicalRenderer {
    pencil;
    constructor(pencil) {
        this.pencil = pencil;
    }
    async render(inputSvgFile, outputFilePath) {
        let options = {};
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
//# sourceMappingURL=PNGPencilRenderer.js.map