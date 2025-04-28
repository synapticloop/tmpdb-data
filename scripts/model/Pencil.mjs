// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import {Component} from "./component/Component.mjs";


export class Pencil {
	static WIDTH = 1200;
	static HEIGHT = 300;
	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`xmlns:xlink="http://www.w3.org/1999/xlink" ` +
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

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateDetails()
	}

	#generateDetails() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
		for(const component of json.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.totalLength += thisComponent.getWidth()

			let tempWidth = thisComponent.getMaxWidth();
			if(tempWidth >= this.maxWidth) {
				this.maxWidth = tempWidth;
			}
			let tempHeight = thisComponent.getMaxHeight();
			if(tempHeight >= this.maxHeight) {
				this.maxHeight = tempHeight;
			}
		}

		if(json.brand) {
			this.brand = json.brand;
		}

		if(json.model) {
			this.model = json.model;
		}

		if(json.lead_size) {
			this.leadSize = json.lead_size;
		}
		if(json.text) {
			this.text = json.text;
		}

		console.log(json);
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

		svgString += `<text x="${100}" y="${Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${(Math.round(this.maxWidth * 100) / 100).toFixed(2)} mm</text>`

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

		svgString += `<text x="${Pencil.WIDTH/2}" y="${Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${(Math.round(this.totalLength/5 * 100) / 100).toFixed(2)} mm</text>`

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

		svgString += Pencil.SVG_END;
		return(svgString);
	}

	getTotalLength() {
		return(this.totalLength);
	}
}