// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import {Component} from "./component/Component.mjs";
import { drawTextBoldCentred } from "../utils/svg-helper.mjs";

export class Pencil {
	static WIDTH = 1200;
	static HEIGHT = 600;
	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${Pencil.WIDTH}" ` +
			`height="${Pencil.HEIGHT}"> ` +
			`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">` +
			`<rect width="6" height="6" fill='none'/> ` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/> ` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/> ` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" /> ` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" /> ` +
			`</pattern>` +
			`<rect x="0" y="0" width="${Pencil.WIDTH}" height="${Pencil.HEIGHT}" fill="white" stroke="black" stroke-width="4" />` +
			`<rect x="2" y="2" width="${Pencil.WIDTH - 4}" height="${Pencil.HEIGHT - 4}" fill="white" stroke="orange" stroke-width="1" />`
			;

	static SVG_END = `<text x="50%" y="${Pencil.HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>` +
			`</svg>`;

	name = "";
	brand = "";
	leadSize = "";
	filePath = "";
	components = [];
	// width = 0;
	text = "";

	maxWidth = 0;
	maxHeight = 0;
	totalLength = 0

	materials = [];
	materialsSet = new Set();
	colourComponent = ""
	colourComponents = [ "white" ];

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateDetails()
	}

	#generateDetails() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

		this.colourComponent = json.colour_component ?? this.colourComponent;

		for(const component of json.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.totalLength += thisComponent.getWidth()

			if(thisComponent.type === this.colourComponent) {
				this.colourComponents = thisComponent.colours;
			}

			let tempWidth = thisComponent.getMaxWidth();
			if(tempWidth >= this.maxWidth) {
				this.maxWidth = tempWidth;
			}
			let tempHeight = thisComponent.getMaxHeight();
			if(tempHeight >= this.maxHeight) {
				this.maxHeight = tempHeight;
			}

			const componentMaterial = component.material;

			if(!this.materialsSet.has(componentMaterial)) {
				this.materials.push(componentMaterial);
				this.materialsSet.add(componentMaterial);
			}
		}

		this.brand = json.brand ?? this.brand;
		this.model = json.model ?? this.model;

		this.leadSize = json.lead_size ?? this.leadSize;
		this.text = json.text ?? this.text;


		// console.log(json);
	}

	renderSvg(shouldColour) {
		let svgString = Pencil.SVG_START;
		let xPosition = (Pencil.WIDTH - this.totalLength)/2;

		svgString += `<text x="30" y="40" font-weight="bold" font-size="2em">${this.brand} // ${this.model} (${this.leadSize}mm)</text>`;
		svgString += `<text x="30" y="60" font-weight="bold" font-size="1.1em">${this.text}</text>`;

		// now for the measurements of the height
		// top horizontal
		svgString += `<line x1="40" y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`x2="60" y2="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// bottom horizontal
		svgString += `<line x1="40" y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`x2="60" y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// down stroke
		svgString += `<line x1="50" y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`x2="50" y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		svgString += drawTextBoldCentred("Front", 100, Pencil.HEIGHT/2 + 80 + this.maxHeight/2 * 5, "1.8em");

		svgString += `<text x="30" y="${Pencil.HEIGHT/2}" transform="rotate(-90, 30, ${Pencil.HEIGHT/2})" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${(Math.round(this.maxHeight * 100) / 100).toFixed(2)} mm</text>`

		// and the measurements of the width
		// horizontal
		svgString += `<line x1="${100 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`x2="${100 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// left
		svgString += `<line x1="${100 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 - this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// right
		svgString += `<line x1="${100 + this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		svgString += drawTextBoldCentred(`${(Math.round(this.maxWidth * 100) / 100).toFixed(2)} mm`, 100, Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5, "1.2em");

		// now for the total
		// horizontal
		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// left
		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 - this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;
		// right
		svgString += `<line x1="${Pencil.WIDTH/2 + this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		svgString += drawTextBoldCentred(`${(Math.round(this.totalLength/5 * 100) / 100).toFixed(2)} mm`, Pencil.WIDTH/2, Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5, "1.2em");
		svgString += drawTextBoldCentred("Side", Pencil.WIDTH/2, Pencil.HEIGHT/2 + 80 + this.maxHeight/2 * 5, "1.8em");
		svgString += drawTextBoldCentred("Back", Pencil.WIDTH-100, Pencil.HEIGHT/2 + 80 + this.maxHeight/2 * 5, "1.8em");
		svgString += drawTextBoldCentred(`Materials: ${this.materials.join(", ")}`, Pencil.WIDTH/2, Pencil.HEIGHT/2 + 200 + this.maxHeight/2 * 5, "1.2em");

		// now we are going to go through each of the components and draw the shapes
		let offset = Pencil.WIDTH/2 - this.getTotalLength()/2;

		for (let component of this.components) {
			svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 - 12 - this.maxHeight/2 * 5}" ` +
					`x2="${offset}" y2="${Pencil.HEIGHT/2 - 34 - this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />`;
			let currentOffset = offset;

			offset += component.getWidth();
			svgString += `<text x="${(offset + currentOffset)/2}" y="${Pencil.HEIGHT/2 - 36 - this.maxHeight/2 * 5}" transform="rotate(-90, ${(offset + currentOffset)/2}, ${Pencil.HEIGHT/2 - 36 - this.maxHeight/2 * 5})" font-size="1.2em" font-weight="bold" dominant-baseline="central">${component.getType()} (${(Math.round(component.getWidth()/5 * 100) / 100).toFixed(2)} mm)</text>`
		}

		svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 - 12 - this.maxHeight/2 * 5}" ` +
				`x2="${offset}" y2="${Pencil.HEIGHT/2 - 34 - this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 - 23 - this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 - 23 - this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		offset = Pencil.WIDTH/2 - this.getTotalLength()/2;
		for (let component of this.components) {
			svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
					`x2="${offset}" y2="${Pencil.HEIGHT/2 + 124 + this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />`;
			let currentOffset = offset;

			offset += component.getWidth();
			svgString += `<text x="${(offset + currentOffset)/2}" y="${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5}" transform="rotate(-90, ${(offset + currentOffset)/2}, ${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5})" font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">${component.getMaterial()}</text>`
		}

		svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
				`x2="${offset}" y2="${Pencil.HEIGHT/2 + 124 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />`;

		for (let component of this.components) {
			svgString += component.renderBack(shouldColour, Pencil.WIDTH - 100);
		}

		this.components.reverse();
		for (let component of this.components) {
			svgString += component.renderFront(shouldColour, 100);
		}
		this.components.reverse();

		// now go through each component and render the parts
		for (let component of this.components) {
			svgString += component.renderSvg(shouldColour, xPosition);
			xPosition += component.getWidth();
		}

		// lets draw the pencil colours

		let colourOffset = Pencil.WIDTH - 60;
		for(let colourComponent of this.colourComponents) {
			svgString += `<rect x="${colourOffset}" y="20" width="40" height="40" stroke="black" stroke-width="2" fill="${colourComponent}" />`;
			colourOffset -= 60;
		}

		svgString += `<text x="${colourOffset + 50 }" y="40" font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">Variants by ${this.colourComponent} colour:</text>`

		svgString += Pencil.SVG_END;

		// now draw the colours

		return(svgString);
	}

	getTotalLength() { return(this.totalLength); }
}