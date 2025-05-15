import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";

export class SVGAllPencilRenderer extends SVGRenderer {
	static SVG_WIDTH = 1000;
	static SVG_HEIGHT = 200;

	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
		`width="${SVGAllPencilRenderer.SVG_WIDTH}" ` +
		`height="${SVGAllPencilRenderer.SVG_HEIGHT}">\n` +
		`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
		`<rect width="6" height="6" fill='none'/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
		`</pattern>\n`
	;

	static SVG_END = `<text x="50%" y="${SVGAllPencilRenderer.SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
		`</svg>\n`;

	constructor(pencil: Pencil) {
		super(pencil);
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {
		// start
		let svgString:string = SVGAllPencilRenderer.SVG_START;

		// now it is time to render the details of the pencil
		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += SVGAllPencilRenderer.SVG_END;
		return(svgString);
	}

	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = SVGAllPencilRenderer.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = SVGAllPencilRenderer.SVG_HEIGHT/2;

		let colour:string = "white";

		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for(let part of component.parts) {
				svgString += super.renderPart(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
			}
		}

		// reset to draw the taper lines last
		startX = SVGAllPencilRenderer.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);

		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for(let part of component.parts) {
				svgString += super.renderTaper(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
			}
		}

		return(svgString);
	}
}