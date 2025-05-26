import { listDirectories, listFiles } from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import sharp from "sharp";
const baseDir = './data/pencil';
// list the directories for the pencil data
const pencilDirectories = listDirectories(baseDir);
for (const pencilDirectory of pencilDirectories) {
    const pencilDir = path.join(baseDir, pencilDirectory);
    console.log(`Searching in directory '${pencilDir}'`);
    const pencilFiles = listFiles(pencilDir);
    console.log(pencilFiles);
    if (pencilFiles.length > 0) {
        console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`);
    }
    for (const [index, pencilFile] of pencilFiles.entries()) {
        console.log(`\t ${index + 1}. ${pencilFile}`);
        const pngOutputDir = path.join("./output/images/pencil/", pencilDirectory);
        fs.mkdirSync(pngOutputDir, { "recursive": true });
        const svgOutputDir = path.join("./output/vectors/pencil/", pencilDirectory);
        fs.mkdirSync(svgOutputDir, { "recursive": true });
        const pencilFileFull = path.join(pencilDir, pencilFile);
        const pencilFileName = path.parse(path.join(pencilDir, pencilFile)).name;
        const pencil = new Pencil(fs.readFileSync(pencilFileFull, "utf8"));
        const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");
        fs.writeFileSync(outputSvgFile, pencil.renderSvg(false, 0, ""));
        writeSvgToPng(outputSvgFile, path.join(pngOutputDir, pencilFileName + ".png"));
        let colourComponent = pencil.colourComponent;
        for (const [index, colour] of pencil.colourComponents.entries()) {
            const outputSvgColourFile = path.join(svgOutputDir, pencilFileName + "-colour-" + colour + ".svg");
            fs.writeFileSync(outputSvgColourFile, pencil.renderSvg(true, index, colourComponent));
            writeSvgToPng(outputSvgColourFile, path.join(pngOutputDir, pencilFileName + "-colour-" + colour + ".png"));
        }
    }
    /**
     * Convert an SVG to a Png image and write it to a file
     *
     * @param inputSvg  The input file location of the SVG
     * @param outputPng The output file location to write the PNG
     */
    function writeSvgToPng(inputSvg, outputPng) {
        // options for things - just in case...
        let options = {};
        sharp(inputSvg, options)
            .png()
            .toFile(outputPng)
            .then(() => {
            console.log(`Successfully converted SVG \n\t'${inputSvg}'\n  to PNG \n\t'${outputPng}'`);
        })
            .catch(error => {
            console.error(`Error converting SVG \n\t'${inputSvg}'\n  to PNG \n\t'${outputPng}'`, error);
        });
    }
}
//# sourceMappingURL=svg-builder.js.map