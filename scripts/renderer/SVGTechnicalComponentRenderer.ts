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
		let svgString:string = this.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT);

		// centre line
		svgString += this.renderCentreLines(
				this.SVG_WIDTH,
				this.SVG_HEIGHT,
				false,
				false);

		// overview text
		svgString += this.renderOverviewText(false);

		// first up the grey guidelines
		svgString += this.renderGuidelines();

		// now we get into the dimensions

		//render the side dimensions
		svgString += this.renderSideDimensions();

		// now it is time to render the details of the pencil
		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);

		return(svgString);
	}

	private renderGuidelines(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number;


		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = this.SVG_WIDTH/2 - this.pencil.totalLength*5/2;

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 140 + this.pencil.maxHeight/2 * 5);

		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 120, 120);

			offset += component.length * 5;

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.length * 5 : 0),
					this.SVG_HEIGHT/2 - 80,
					80);
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 + extraPart.extraLength*5 - (component.extraPartFirst ? component.length * 5 : 0),
					this.SVG_HEIGHT/2 - 80,
					80);
			}
		}

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 140 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}


	private renderSideDimensions(): string {
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
			xOffset += component.length * 5;

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(xOffset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.length * 5 : 0),
					this.SVG_HEIGHT/2 - 80,
					extraPart.extraLength * 5 - (component.extraPartFirst ? component.length * 5 : 0),
					`${component.getType()} (extra)`,
					TextOrientation.TOP,
					true);
			}
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

	private renderSideComponents(colourIndex:number): string {
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

	private renderFrontComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = 160;
		let midY = this.SVG_HEIGHT/2;

		let colour = "white";

		// we want to render them back to front so that the last component is on
		// the bottom

		this.pencil.components.reverse()

		// go through the components and render them
		for(const component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			component.parts.reverse();
			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.startHeight / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.startHeight, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraWidth,
							part.extraParts,
							colour);
						part.extraParts.reverse();
						break;
				}
			}
			component.parts.reverse();
		}

		// now put it back in order
		this.pencil.components.reverse()

		for(let front of this.pencil.front) {
			// only care about the first dimension - which is the width
			let dimensions: number[] = front.dimensions;

			if (this.pencil.colourMap[front.fill]) {
				colour = this.pencil.colourMap[front.fill];
			}

			// render the front piece
			switch (front.type) {
				case "cylinder":
					svgString += circle(160, this.SVG_HEIGHT/2, dimensions[0]/2 * 5, "0.5", "dimgray", front.fill);
					break;
			}
		}

		return(svgString);
	}

	private renderBackComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = this.SVG_WIDTH - 100;
		let midY = this.SVG_HEIGHT/2;


		let colour = "white";
		// go through the components and render them
		for(const component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.startHeight / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.startHeight, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraWidth,
							part.extraParts,
							colour);
						part.extraParts.reverse();
						break;
				}
			}
		}

		for(let back of this.pencil.back) {
			if (this.pencil.colourMap[back.fill]) {
				colour = this.pencil.colourMap[back.fill];
			}

			// render the back piece
			switch (back.type) {
				case "cylinder":
					svgString += circle(this.SVG_WIDTH - 100, this.SVG_HEIGHT/2, back.dimensions[0]/2 * 5, "1", "dimgray", back.fill);
					break;
			}
		}

		return(svgString);
	}

}