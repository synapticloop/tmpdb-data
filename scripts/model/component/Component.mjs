import {Part} from "./Part.mjs";
import {Pencil} from "../Pencil.mjs";

export class Component {
	parts = [];
	material = "unknown";
	colours = [ "white" ];
	type = "unknown";
	width = 0;
	maxWidth = 0;
	maxHeight = 0;
	extraParts = [];

	constructor(jsonObject) {
		this.type = jsonObject.type ?? this.type;
		this.material = jsonObject.material ?? this.material;
		this.colours = jsonObject.colours ?? this.colours;

		if(jsonObject.parts) {
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part, this.colours);
				this.parts.push(thisPart);
				this.width += thisPart.getWidth();

				if(thisPart.extraParts.length > 0) {
					this.extraParts.push(thisPart);
				}


				let tempWidth = thisPart.getMaxWidth();
				if(tempWidth >= this.maxWidth) {
					this.maxWidth = tempWidth;
				}

				let tempHeight = thisPart.getMaxHeight();
				if(tempHeight >= this.maxHeight) {
					this.maxHeight = tempHeight;
				}
			}
		}
	}

	renderSvg(shouldColour, startX, colourMap, index, colourComponent) {
		let fillColour = shouldColour ? this.colours[0] : "white";
		if(this.type === colourComponent) {
			fillColour = this.colours[index];
		}

		if (colourMap[fillColour]) {
			fillColour = colourMap[fillColour];
		}

		let xPosition = startX;
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderSvg(fillColour, this.type, xPosition, Pencil.HEIGHT/2)}\n`;
			xPosition += part.getWidth();
		}

		return(svgString);
	}

	renderBack(shouldColour, startX, colourMap, index, colourComponent) {
		let fillColour = shouldColour ? this.colours[0] : "white";
		if(this.type === colourComponent) {
			fillColour = this.colours[index];
		}

		if (colourMap[fillColour]) {
			fillColour = colourMap[fillColour];
		}

		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderBack(fillColour, this.type, startX, Pencil.HEIGHT/2)}\n`;
		}
		return(svgString);
	}

	renderFront(shouldColour, startX, colourMap, index, colourComponent) {
		let fillColour = shouldColour ? this.colours[0] : "white";
		if(this.type === colourComponent) {
			fillColour = this.colours[index];
		}

		if (colourMap[fillColour]) {
			fillColour = colourMap[fillColour];
		}

		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString = `${part.renderFront(fillColour, this.type, startX, Pencil.HEIGHT/2)}\n` + svgString;
		}

		return(svgString);
	}

	getWidth() {
		return(this.width);
	}

	getMaxHeight() {
		return(this.maxHeight);
	}

	getMaxWidth() {
		return(this.maxWidth);
	}

	getType() {
		return(this.type);
	}

	getMaterial() {
		return(this.material);
	}

	getExtraParts() {
		return(this.extraParts);
	}
}