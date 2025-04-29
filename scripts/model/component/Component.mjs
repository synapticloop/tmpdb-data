import {Part} from "./Part.mjs";
import {Pencil} from "../Pencil.mjs";

export class Component {
	parts = [];
	material = "";
	colours = [];
	type = "";
	width = 0;
	maxWidth = 0;
	maxHeight = 0;

	constructor(jsonObject) {
		this.type = jsonObject.type;

		if(jsonObject.material) {
			this.material = jsonObject.material;
		}

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		} else {
			this.colours.push("white");
		}

		if(jsonObject.parts) {
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part, this.colours);
				this.parts.push(thisPart);
				this.width += thisPart.getWidth();

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

	renderSvg(shouldColour, startX) {
		const fillColour = shouldColour ? this.colours[0] : "white";
		let xPosition = startX;
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderSvg(fillColour, this.type, xPosition, Pencil.HEIGHT/2)}\n`;
			xPosition += part.getWidth();
		}

		return(svgString);
	}

	renderBack(shouldColour, startX) {
		const fillColour = shouldColour ? this.colours[0] : "white";
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString += `${part.renderBack(fillColour, this.type, startX, Pencil.HEIGHT/2)}\n`;
		}
		return(svgString);
	}

	renderFront(shouldColour, startX) {
		const fillColour = shouldColour ? this.colours[0] : "white";
		let svgString = `\n<!-- RENDERING - component: ${this.type} -->\n`;
		for(let part of this.parts) {
			svgString = `${part.renderBack(fillColour, this.type, startX, Pencil.HEIGHT/2)}\n` + svgString;
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
}