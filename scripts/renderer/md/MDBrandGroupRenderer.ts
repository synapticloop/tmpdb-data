import {Pencil} from "../../model/Pencil.ts";
import {Accuracy} from "../../model/meta/Accuracy.ts";
import {formatToOnePlace} from "../../utils/formatter.ts";
import path from "node:path";
import fs from "fs";

export class MDBrandGroupRenderer {
	pencils: Pencil[];
	pencilFileNames: string[];
	pencilFileDirectories: string[];

	constructor(pencils: Pencil[], pencilFileNames: string[], pencilFileDirectories: string[]) {
		this.pencils = pencils;
		this.pencilFileNames = pencilFileNames;
		this.pencilFileDirectories = pencilFileDirectories;
	}

	render(): string {
		let mdString: string = `# ${this.pencils[0].brand}\n\n`;

		mdString += `Available pencil definitions:\n\n`;
		// list the pencil models
		for(const [ index, pencil ] of this.pencils.entries()) {
			mdString += ` - ${pencil.modelName} ${pencil.modelNumber} - (${formatToOnePlace(pencil.leadSize)}mm) \n\n`
		}

		for(const [ index, pencil ] of this.pencils.entries()) {
			mdString += `## ${pencil.brand} ${pencil.modelName} ${pencil.modelNumber} - (${formatToOnePlace(pencil.leadSize)}mm) \n\n`
			mdString += `Accuracy level for information on this pencil: \`${pencil.accuracy}\`\n\n`

			mdString += `### Pencil Information\n\n`

			mdString += "| `---Item---` | `---Information---` |\n";
			mdString += "| ---: | :--- |\n";
			mdString += this.addTableRow("Brand", pencil.brand);
			mdString += this.addTableRow("Model name", pencil.modelName);
			mdString += this.addTableRow("Model number", pencil.modelNumber);
			mdString += this.addTableRow("Weight", `${pencil.weight} g`);
			mdString += this.addTableRow("Mechanism", pencil.mechanism);
			mdString += this.addTableRow("Lead size", `${formatToOnePlace(pencil.leadSize)} mm`);
			mdString += this.addTableRow("Lead shape", pencil.leadShape);
			mdString += this.addTableRow("Maximum lead length", pencil.maximumLeadLength);
			mdString += this.addTableRow("Manufactured in", pencil.manufacturedIn);

			for(const [ index, feature ] of pencil.features.entries()) {
				if(index === 0) {
					mdString += this.addTableRow("\`---Feature---\`", "**\`---Location---\`**");
				}
				mdString += this.addTableRow(`${feature.type}`, `${feature.location}`);
			}

			mdString += `### Pencil Measurements\n\n`
			mdString += "| `---Item---` | `---Information---` | `---Offset---` |\n";
			mdString += "| ---: | :--- | :--- |\n";



			mdString += `\n\n<img src="./${this.pencilFileDirectories[index]}/${this.pencilFileNames[index]}-grouped.png" />\n\n`

			mdString += `\n\n### Colours\n\n`;
			mdString += "\n\n| Colour | SKU | Manufacture dates |\n";
			mdString += "| ---: | :--- | :--- |\n";
			for(const [ index, colourComponent ] of pencil.colourComponents.entries()) {
				mdString += this.addTableRow(
					`${colourComponent.colourName}`,
					`${pencil.skus[index] ? pencil.skus[index] : "unrecorded"} | From: ${pencil.manufacturedFrom[index]} to ${pencil.manufacturedTo[index]}`);
			}

			mdString += "\n\n---\n\n";
		}

		mdString += "### Accuracy Designations\n\n";
		for (const accuracyLevel of Accuracy.getAccuracyLevels()) {

			mdString += `#### ${accuracyLevel}\n\n`;

			for (const accuracyDescription of Accuracy.getAccuracyDescription(accuracyLevel)) {
				mdString += ` - ${accuracyDescription}\n`;
			}

			mdString += `\n`;
		}

		return(mdString);
	}

	private addTableRow(item: string, value: any): string {
		return(`| **${item}** | ${value} |\n`);
	}

}
