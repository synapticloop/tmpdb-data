import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";

export class SVGPencilAllRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

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

		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT = 120 + this.pencil.colourComponents.length * 120;

		// start
		let svgString:string = `<svg xmlns="http://www.w3.org/2000/svg" ` +
				`width="${this.SVG_WIDTH}" ` +
				`height="${this.SVG_HEIGHT}">\n` +
				`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
				`<rect width="6" height="6" fill='none'/>\n` +
				`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
				`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
				`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
				`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
				`</pattern>\n`

		let y: number = 80;
		for (let i:number = 0; i < this.pencil.colourComponents.length; i++) {
			// now it is time to render the details of the pencil
			svgString += this.renderSideComponents(y, i);
			y = y + 120;
		}

		// end the end of the SVG
		svgString += `<text x="50%" y="${this.SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
				`</svg>\n`;
		return(svgString);
	}

	private renderSideComponents(midY: number, colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);

		let colour:string = "white";

		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for(let part of component.parts) {
				svgString += super.renderPart(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
			}
		}

		// reset to draw the taper lines last
		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);

		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for(let part of component.parts) {
				svgString += super.renderTaper(startX, midY, part, colour);
				startX += part.length * 5;
			}
		}

		return(svgString);
	}
}