import {Pencil} from "../../model/Pencil.ts";

export class MDIndividualRenderer {
	pencil: Pencil;
	pencilFileName: string

	constructor(pencil: Pencil, pencilFileName: string) {
		this.pencil = pencil;
		this.pencilFileName = pencilFileName;
	}

	render(): string {
		let mdString: string = "";
		mdString += `# ${this.pencil.brand} // ${this.pencil.modelName} ${this.pencil.leadSize} mm\n\n`;
		mdString += `## Model #: ${this.pencil.modelNumber}\n\n`;

		// image for the overview
		mdString += `<img src="./${this.pencilFileName}-grouped.png">\n\n`

		mdString += `## Pencil Information\n\n`;

		mdString += "|     |     |\n";
		mdString += "| ---: | :--- |\n";
		mdString += this.addTableRow("Brand", this.pencil.brand);
		mdString += this.addTableRow("Model name", this.pencil.modelName);
		mdString += this.addTableRow("Model number", this.pencil.modelNumber);
		mdString += this.addTableRow("Mechanism", this.pencil.mechanism);
		mdString += this.addTableRow("Lead size", this.pencil.leadSize);
		mdString += this.addTableRow("Lead shape", this.pencil.leadShape);
		mdString += this.addTableRow("Maximum lead length", this.pencil.maximumLeadLength);

		mdString += "\n\n---\n\n_`[Rendered with MDIndividualRenderer]`_\n\n---\n\n";

		return(mdString);
	}

	private addTableRow(item: string, value: any): string {
		return(`| **${item}** | ${value} |\n`);
	}
}
