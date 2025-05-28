import {Pencil} from "../../model/Pencil.ts";
import {Accuracy} from "../../model/meta/Accuracy.ts";

export class MDReadmeRenderer {
	pencils: Pencil[];

	constructor(pencils: Pencil[]) {
		this.pencils = pencils;
	}

	render(): string {
		let mdString: string = "";
		mdString += "| Brand | Name | Model # | Lead Size<br />_(mm)_ | # Variants<br />_(colours / patterns)_ | Accuracy |\n";
		mdString += "| ---: | :--- | :--- | ---: | ---: | :--- |\n";
		let numVariants: number = 0;
		for(const pencil of this.pencils) {
			mdString += `| **${pencil.brand}** | **${pencil.modelName}** | ${pencil.modelNumber} | ${pencil.leadSize} | ${pencil.colourComponents.length} | ${pencil.accuracy} |\n`;
			numVariants += pencil.colourVariants.length;
		}
		mdString += `| | | **${this.pencils.length} Pencils** | **${numVariants} Variants**<br />_(colours / patterns)_  |\n\n\n`;

		mdString += "### Accuracy Designations\n\n"
		for (const accuracyLevel of Accuracy.getAccuracyLevels()) {

			mdString += `#### ${accuracyLevel}\n\n`;

			for (const accuracyDescription of Accuracy.getAccuracyDescription(accuracyLevel)) {
				mdString += ` - ${accuracyDescription}\n`;
			}

			mdString += `\n`;
		}

		return(mdString);
	}
}
