// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import {Component} from "./component/Component.mjs";


export class Pencil {
	static WIDTH = 1200;
	static HEIGHT = 400;
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
	width = 0;
	text = "";

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateDetails()
	}

	#generateDetails() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
		for(const component of json.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.width += thisComponent.getWidth()
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
		let xPosition = (Pencil.WIDTH - this.width)/2;

		svgString += `<text x="10" y="30" font-weight="bold" font-size="2em">${this.brand} // ${this.model} (${this.leadSize}mm)</text>`;
		svgString += `<text x="10" y="50" font-weight="bold" font-size="1.1em">${this.text}</text>`;

		for (let component of this.components) {
			svgString += component.renderBack(shouldColour, Pencil.WIDTH - (Pencil.WIDTH - this.width)/2 + 100);
		}

		this.components.reverse();
		for (let component of this.components) {
			svgString += component.renderFront(shouldColour, (Pencil.WIDTH - this.width)/2 - 100);
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
}