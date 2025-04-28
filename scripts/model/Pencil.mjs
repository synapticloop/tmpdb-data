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
			`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="6" height="6">` +
			`<rect width="6" height="6" fill='white'/> ` +
			`<path stroke="black" stroke-linecap="round" stroke-width="1" d="M 3,3 L 6,6"/> ` +
			`<path stroke="black" stroke-linecap="round" stroke-width="1" d="M 3,3 L 0,6"/> ` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 3,3 L 6,0" /> ` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 3,3 L 0,0" /> ` +
			`</pattern>` +
			`<rect x="0" y="0" width="${Pencil.WIDTH}" height="${Pencil.HEIGHT}" fill="white" stroke="black" stroke-width="2" />`;

	static SVG_END = "</svg>";

	filePath = "";
	components = [];
	width = 0;

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateComponents()
	}

	#generateComponents() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
		for(const component of json.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.width += thisComponent.getWidth()
		}
		console.log(json);
	}

	renderSvg() {
		let svgString = Pencil.SVG_START;
		let xPosition = (Pencil.WIDTH - this.width)/2;

		// now go through each component and render the parts
		for (let component of this.components) {
			svgString += component.renderSvg(xPosition);
			xPosition += component.getWidth();
		}

		svgString += Pencil.SVG_END;
		return(svgString);
	}
}