import {Part} from "./Part.mjs";
import {Pencil} from "../Pencil.mjs";

export class Component {
	parts = [];
	material = "";
	colours = [];
	type = "";
	width = 0;

	constructor(jsonObject) {
		this.type = jsonObject.type;

		if(jsonObject.material) {
			this.material = jsonObject.material;
		}

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		}

		if(jsonObject.parts) {
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part);
				this.parts.push(thisPart);
				this.width += thisPart.getWidth();
			}
		}
	}

	renderSvg(startX) {
		let xPosition = startX;
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderSvg(this.type, xPosition, Pencil.HEIGHT/2)}\n`;
			xPosition += part.getWidth();
		}
		return(svgString);
	}

	getWidth() {
		return(this.width);
	}
}