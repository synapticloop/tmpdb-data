import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
import {
	lineVerticalGuide,
} from "../utils/svg-helper.ts";

export class SVGTechnicalComponentRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 600;

	constructor(pencil: Pencil) {
		super(pencil, 1200, 600, "SVGTechnicalComponentRenderer");
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
		let svgString:string = super.getSvgStart();

		// centre line
		svgString += super.renderCentreLines(
				this.SVG_WIDTH,
				this.SVG_HEIGHT,
				false,
				false);

		// overview text
		svgString += super.renderOverviewText(false);

		// first up the grey guidelines
		svgString += this.renderGuidelinesFull();

		// now we get into the dimensions

		//render the side dimensions
		svgString += super.renderSideDimensions();

		// now it is time to render the details of the pencil
		svgString += super.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += super.getSvgEnd();

		return(svgString);
	}

	private renderGuidelinesFull(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number;


		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = this.SVG_WIDTH/2 - this.pencil.totalLength*5/2;

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 88 + this.pencil.maxHeight/2 * 5);

		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 120, 120);

			// now for extraParts
			for(const extra of component.extras) {
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5,
					this.SVG_HEIGHT/2 - 80,
					80);
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5 + extra.length*5,
					this.SVG_HEIGHT/2 - 80,
					80);
			}

			offset += component.length * 5;

		}

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 88 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}
}