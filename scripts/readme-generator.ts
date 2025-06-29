import {listDirectories, listFiles} from "./utils/filesystem.ts";
import * as path from "node:path";
import { Pencil } from "./model/Pencil.ts";
import fs from "fs";
import {PNGRenderer} from "./renderer/png/PNGRenderer.ts";
import {SVGRenderer} from "./renderer/svg/SVGRenderer.ts";
import {ObjectMapper} from "json-object-mapper";
import deserialize = ObjectMapper.deserialize;
import {SVGExampleRenderer} from "./renderer/svg/example/SVGExampleRenderer.ts";
import {MDReadmeRenderer} from "./renderer/md/MDReadmeRenderer.ts";
import {Accuracy} from "./model/meta/Accuracy.ts";

let baseDir:string = './data/pencil';

// list the directories for the pencil data
const pencilDirectories:string[] = listDirectories(baseDir);

let numPencils: number = 0;
let numColours: number = 0;

const pencils: Pencil[] = []
let mdString: string = fs.readFileSync("./data/documentation/README-start.md", "utf8");

let individualOverviewString: string = "";

for (const [dirIndex, pencilDirectory] of pencilDirectories.entries()) {
	const pencilDir: string = path.join(baseDir, pencilDirectory);
	const pencilFiles: string[] = listFiles(pencilDir);

	if (pencilFiles.length > 0) {
		for (const [index, pencilFile] of pencilFiles.entries()) {
			const pencilFileFull: string = path.join(pencilDir, pencilFile);

			const pencilFileContents = JSON.parse(fs.readFileSync(pencilFileFull, "utf8"));
			const pencil: Pencil = deserialize(Pencil, pencilFileContents);

			pencil.postConstruct(pencil.getColours(), pencil.colourMap);
			pencils.push(pencil);
		}
	}
}

pencils.sort((a: Pencil, b: Pencil): number => {
	if(a.brand === b.brand) {
		// same brand
		return(a.modelName.localeCompare(b.modelName));
	} else {
		return a.brand.localeCompare(b.brand)
	}
});

mdString += new MDReadmeRenderer(pencils).render();

mdString += "\n\n## Individual pencil's overview\n\n"


mdString += "### Accuracy Designations\n\n"
for (const accuracyLevel of Accuracy.getAccuracyLevels()) {

	mdString += `#### ${accuracyLevel}\n\n`;

	for (const accuracyDescription of Accuracy.getAccuracyDescription(accuracyLevel)) {
		mdString += ` - ${accuracyDescription}\n`;
	}

	mdString += `\n`;
}

mdString += fs.readFileSync("./data/documentation/README-end.md", "utf8");

fs.writeFileSync("./README.md", mdString);
