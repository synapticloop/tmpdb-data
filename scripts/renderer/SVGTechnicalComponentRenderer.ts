import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
import {
	circle,
	dimensionsHorizontal,
	dimensionsVertical,
	drawExtra,
	drawOutlineCircle,
	drawOutlineHexagon,
	drawOutlineOctagon,
	drawShapeDetails,
	drawText,
	drawTextBold,
	drawTextBoldCentred,
	lineHorizontal,
	lineHorizontalGuide,
	lineVertical,
	lineVerticalGuide,
	renderBackExtra,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";

export class SVGTechnicalComponentRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 500;

	constructor(pencil: Pencil) {
		super(pencil, 1200, 500, "SVGTechnicalComponentRenderer");
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
		let svgString:string = super.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT);

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
		svgString += super.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);

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

			offset += component.length * 5;

			// now for extraParts
			for(const extra of component.extras) {
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5,
					this.SVG_HEIGHT/2 - 80,
					80);
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5 + extra.length*5,
					this.SVG_HEIGHT/2 - 80,
					80);
			}
		}

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 88 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}


	private deprecatedrenderSideDimensions(): string {
		let svgString: string = "";

		let xOffset: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		for (let component of this.pencil.components) {
			// draw all the dimensions
			svgString += dimensionsHorizontal(xOffset,
				this.SVG_HEIGHT/2 - 120,
				component.length * 5,
				`${component.type}`,
				TextOrientation.TOP_ROTATED,
				true);

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extra of component.extras) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(xOffset + extra.offset[0] * 5,
					this.SVG_HEIGHT/2 - 80,
						extra.length * 5,
					`${component.type} (extra)`,
					TextOrientation.TOP,
					true);
			}
			xOffset += component.length * 5;
		}

		// now for the total length
		svgString += dimensionsHorizontal(
			this.SVG_WIDTH/2 - this.pencil.totalLength*5/2,
			this.SVG_HEIGHT/2 + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength*5,
			"",
			TextOrientation.BOTTOM,
			true
		);

		return(svgString);
	}

	private deprecatedrenderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = this.SVG_HEIGHT/2;

		for (let component of this.pencil.components) {
			let colour: string = this.getMappedColour(component, "white", colourIndex);

			for(let part of component.parts) {
				svgString += super.renderPart(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
			}
		}

		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);

		for (let component of this.pencil.components) {
			let colour: string = this.getMappedColour(component, "white", colourIndex);

			for(let part of component.parts) {
				svgString += super.renderTaper(startX, midY, part, colour);
				startX += part.length * 5;
			}
		}

		return(svgString);
	}
}