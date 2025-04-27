// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import {Component} from "./component/Component.mjs";


export class Pencil {
	static WIDTH = 1000;
	static HEIGHT = 600;
	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${Pencil.WIDTH}" height="${Pencil.HEIGHT}" style="background-color:#ff3400;">`;
	static SVG_END = "</svg>";

	filePath = "";
	components = [];

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateComponents()
	}

	#generateComponents() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
		for(const component of json.components) {
			this.components.push(new Component(component));
		}
		console.log(json);
	}

	renderSvg() {
		let svgString = Pencil.SVG_START;

		// now go through each component and render the parts
		for (let component of this.components) {
			svgString += component.renderSvg();
		}

		svgString += Pencil.SVG_END;
		return(svgString);
	}
}