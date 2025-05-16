import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";

export class SVGPencilRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1000;
	SVG_HEIGHT: number = 200;

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
		let svgString:string = this.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT, true);

		// now it is time to render the details of the pencil
		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);
		return(svgString);
	}

	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = this.SVG_HEIGHT/2;

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