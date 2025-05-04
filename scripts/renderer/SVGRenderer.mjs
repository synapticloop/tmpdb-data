import { Pencil } from "../model/Pencil.mjs";
import {SVG_HEIGHT, SVG_WIDTH} from "../utils/svg-helper.mjs";

export class SVGRenderer {
	static SVG_WIDTH = 1500;
	static SVG_HEIGHT = 600;

	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${SVG_WIDTH}" ` +
			`height="${SVG_HEIGHT}">\n` +
			`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
			`<rect width="6" height="6" fill='none'/>\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
			`</pattern>\n` +
			`<rect x="0" y="0" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="white" stroke="black" stroke-width="4" />\n` +
			`<rect x="2" y="2" width="${SVG_WIDTH - 4}" height="${SVG_HEIGHT - 4}" fill="white" stroke="orange" stroke-width="1" />\n`
	;

	static SVG_END = `<text x="50%" y="${SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
			`</svg>\n`;

	renderJSONToSVG(inputJSONFile, outputSVGFile) {

	}
}