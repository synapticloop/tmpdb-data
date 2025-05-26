import {Pencil} from "../../model/Pencil.ts";

export class MDReadmeRenderer {
	pencils: Pencil[];

	constructor(pencils: Pencil[]) {
		this.pencils = pencils;
	}

	render(): string {
		let mdString: string = "";
		mdString += "| Brand | Name | Model # | # Colours |\n";
		mdString += "| ---: | :--- | :--- | ---: |\n";
		for(const pencil of this.pencils) {
			mdString += `| **${pencil.brand}** | **${pencil.modelName}** | ${pencil.modelNumber} | ${pencil.colourComponents.length} |\n`;
		}
		return(mdString);
	}
}
