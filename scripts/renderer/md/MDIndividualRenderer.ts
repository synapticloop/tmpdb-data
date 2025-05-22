import {Pencil} from "../../model/Pencil.ts";

export class MDRenderer {
	pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(): string {
		let mdString: string = "";
		mdString += `# ${this.pencil.brand} // ${this.pencil.modelName} (Model #: ${this.pencil.modelNumber})\n`;
		return(mdString);
	}
}
