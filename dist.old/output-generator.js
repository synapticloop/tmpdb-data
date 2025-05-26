import { listDirectories, listFiles } from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import { PNGRenderer } from "./renderer/png/PNGRenderer.ts";
import { SVGTechnicalExplodedRenderer } from "./renderer/svg/technical/SVGTechnicalExplodedRenderer.ts";
import { SVGPencilAllRenderer } from "./renderer/svg/pencil/SVGPencilAllRenderer.ts";
import { ObjectMapper } from "json-object-mapper";
var deserialize = ObjectMapper.deserialize;
let baseDir = './data/pencil';
if (process.argv[2]) {
    baseDir = process.argv[2];
}
// list the directories for the pencil data
const pencilDirectories = listDirectories(baseDir);
let numPencils = 0;
let numColours = 0;
for (const [dirIndex, pencilDirectory] of pencilDirectories.entries()) {
    const pencilDir = path.join(baseDir, pencilDirectory);
    const pencilFiles = listFiles(pencilDir);
    if (pencilFiles.length > 0) {
        console.log(`Generating for brand '${pencilDirectory}' - ${pencilFiles.length} file(s)`);
        for (const [index, pencilFile] of pencilFiles.entries()) {
            console.log(`    ${numPencils + 1}. ${pencilFile}`);
            const pencilFileFull = path.join(pencilDir, pencilFile);
            const pencilFileName = path.parse(path.join(pencilDir, pencilFile)).name;
            const pencilFileContents = JSON.parse(fs.readFileSync(pencilFileFull, "utf8"));
            const pencil = deserialize(Pencil, pencilFileContents);
            pencil.postConstruct(pencil.getColours(), pencil.colourMap);
            let fileNumber = 1;
            // fileNumber = await renderSVGAndPNG(new SVGTechnicalRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName, fileNumber);
            // fileNumber = await renderSVGAndPNG(new SVGTechnicalGroupedRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-grouped", fileNumber);
            // fileNumber = await renderSVGAndPNG(new SVGTechnicalComponentRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-components", fileNumber);
            fileNumber = await renderSVGAndPNG(new SVGTechnicalExplodedRenderer(pencil), -1, "technical", pencilDirectory, pencilFileName + "-exploded", fileNumber);
            // fileNumber = await renderSVGAndPNG(new SVGPencilRenderer(pencil), -1, "pencil", pencilDirectory, pencilFileName, fileNumber);
            fileNumber = await renderSVGAndPNG(new SVGPencilAllRenderer(pencil), -1, "pencil", pencilDirectory, pencilFileName + "-all-variants", fileNumber);
            // fileNumber = await renderSVGAndPNG(new SVGPencil45Renderer(pencil), -1, "pencil", pencilDirectory, pencilFileName + "-45", fileNumber);
            // now go through the colours
            for (let [index, colourComponent] of pencil.colourComponents.entries()) {
                const pencilColourOutputFileName = pencilFileName + "-colour-" + colourComponent.colourName;
                const pencilExplodedColourOutputFileName = pencilFileName + "-exploded-colour-" + colourComponent.colourName;
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
async function renderSVGAndPNG(svgRenderer, offsetIndex, outputDirectoryType, pencilDirectory, pencilFileName, fileNumber) {
    const outputSVGFileTechnical = renderSVG(svgRenderer, offsetIndex, outputDirectoryType, pencilDirectory, pencilFileName, fileNumber);
    fileNumber++;
    await renderPNG(outputSVGFileTechnical, outputDirectoryType, pencilDirectory, pencilFileName, fileNumber)
        .then(r => { });
    fileNumber++;
    return (fileNumber);
}
function renderSVG(svgRenderer, offsetIndex, outputDirectoryType, pencilDirectory, pencilFileName, fileNumber) {
    const svgOutputDir = path.join("./output/svg/", outputDirectoryType, pencilDirectory);
    fs.mkdirSync(svgOutputDir, { "recursive": true });
    const outputSvgFile = path.join(svgOutputDir, pencilFileName + ".svg");
    const svgString = svgRenderer.render(offsetIndex);
    fs.writeFileSync(outputSvgFile, svgString);
    console.log(`       SVG: [${fileNumber}] (${outputDirectoryType}) ${outputSvgFile}`);
    return (outputSvgFile);
}
async function renderPNG(inputSVGFile, outputDirectoryType, pencilDirectory, pencilFileName, fileNumber) {
    const pngOutputDir = path.join("./output/png/", outputDirectoryType, pencilDirectory);
    fs.mkdirSync(pngOutputDir, { "recursive": true });
    const outputPngFile = path.join(pngOutputDir, pencilFileName + ".png");
    await new PNGRenderer().render(inputSVGFile, outputPngFile)
        .then(() => { })
        .catch(error => {
        console.error(error);
    });
    console.log(`       PNG: [${fileNumber}] (${outputDirectoryType}) ${outputPngFile}`);
}
//# sourceMappingURL=output-generator.js.map