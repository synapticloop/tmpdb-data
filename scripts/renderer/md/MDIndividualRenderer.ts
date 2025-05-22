import {Pencil} from "../../model/Pencil.ts";

export class MDRenderer {
	pencil: Pencil;
	pencilFileName: string

	constructor(pencil: Pencil, pencilFileName: string) {
		this.pencil = pencil;
		this.pencilFileName = pencilFileName;
	}

	render(): string {
		let mdString: string = "";
		mdString += `# ${this.pencil.brand} // ${this.pencil.modelName} (Model #: ${this.pencil.modelNumber})\n`;

		// image for the overview
		mdString += `[${this.pencil.brand} // ${this.pencil.modelName}](./${this.pencilFileName}-grouped.png)`
		return(mdString);
	}
}
