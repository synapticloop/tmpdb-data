import {Pencil} from "../../model/Pencil.ts";

export class MDReadmeRenderer {
	pencils: Pencil[];

	constructor(pencils: Pencil[]) {
		this.pencils = pencils;
	}

	render(): string {
		let mdString: string = "";
		mdString += "| Brand | Name | Model # | # Variants<br />_(colours)_ |\n";
		mdString += "| ---: | :--- | :--- | ---: |\n";
		let numVariants: number = 0;
		for(const pencil of this.pencils) {
			mdString += `| **${pencil.brand}** | **${pencil.modelName}** | ${pencil.modelNumber} | ${pencil.colourComponents.length} |\n`;
			numVariants += pencil.colourVariants.length;
		}
		mdString += `| | | **${this.pencils.length} Pencils** | **${numVariants} Variants**<br />_(colours)_  |\n`;
		return(mdString);
	}
}
