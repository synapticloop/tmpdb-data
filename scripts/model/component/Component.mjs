import {Part} from "./Part.mjs";
import {Pencil} from "../Pencil.mjs";

export class Component {
	parts = [];
	material = "";
	colours = [];
	type = "";

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
				this.parts.push(new Part(part));
			}
		}
	}

	renderSvg() {
		let xPosition = 100;
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderSvg(xPosition, Pencil.HEIGHT/2)}\n`;
			xPosition += part.getWidth();
		}
		return(svgString);
	}
}