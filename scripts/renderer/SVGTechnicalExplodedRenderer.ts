import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
import {
	arrowLeft,
	circle,
	dimensionsHorizontal,
	dimensionsVertical, drawExtra, drawOutlineCircle, drawOutlineHexagon, drawOutlineOctagon, drawShapeDetails,
	drawText,
	drawTextBold,
	drawTextBoldCentred,
	lineHorizontal,
	lineHorizontalGuide,
	lineVertical,
	lineVerticalGuide, rectangle, renderBackExtra,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";
import {Part} from "../model/Part.ts";
import {formatToTwoPlaces} from "../utils/formatter.ts";
import {OpacityColour} from "../model/OpacityColour.ts";

export class SVGTechnicalExplodedRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 200;


	constructor(pencil: Pencil) {
		super(pencil, 1200, 200, "SVGTechnicalExplodedRenderer");
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
		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT += this.pencil.maxHeight
		for(const [index, component] of this.pencil.components.entries()) {
			if(component.hasInternalStart || component.hasInternalEnd ) {
				this.SVG_HEIGHT += 120;
			}
			if(component.isHidden) {
				this.SVG_HEIGHT += 120;
			}
		}

		super.resize(this.SVG_WIDTH, this.SVG_HEIGHT);

		let svgString:string = this.getSvgStart();

		// overview text
		svgString += this.renderOverviewText(false);

		// now it is time to render the details of the pencil

		svgString += this.renderExplodedSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd();

		return(svgString);
	}


	private renderExplodedSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = 120;

		let colour: OpacityColour = new OpacityColour(this.pencil.colourMap, "white");

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				// if we have an internal_start part, then increment the
				if(component.hasInternalStart) {
					midY += 100;
				}
			}

			colour = this.getMappedColour(component.colours, colourIndex, colour.colour);

			let partLength:number = 0;
			let endPartLength: number = 0;

			if(component.isHidden) {
				let totalLength: number = component.length;
				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += `<line x1="${startX - 30}" ` +
						`y1="${midY}" ` +
						`x2="${startX - 20}" ` +
						`y2="${midY - 10}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;
					svgString += `<line x1="${startX - 30}" ` +
						`y1="${midY}" ` +
						`x2="${startX - 20}" ` +
						`y2="${midY + 10}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;

					for (let internalPart of component.internalStart) {
						colour = this.getMappedColour(internalPart.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, component, internalPart, colourIndex, colour);
						startX += internalPart.length * 5
					}


					svgString += `<line x1="${prevStartX - 40}" ` +
						`y1="${midY - 50}" ` +
						`x2="${startX + 40}" ` +
						`y2="${midY - 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += `<line x1="${startX + 10}" ` +
						`y1="${midY - 100}" ` +
						`x2="${startX + 20}" ` +
						`y2="${midY - 110}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;
					svgString += `<line x1="${startX + 10}" ` +
						`y1="${midY - 100}" ` +
						`x2="${startX + 20}" ` +
						`y2="${midY - 90}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;
				}

				if (component.hasInternalEnd) {
					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					let previousPart:Part = null;
					for (let internalPart of component.internalEnd) {
						colour = this.getMappedColour(internalPart.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, component, internalPart, colourIndex, colour);
						totalLength += internalPart.length;
						startX += internalPart.length * 5

						// if we have an offset (which we only have on an end internal)
						if(previousPart !== null && internalPart.internalOffset !== 0) {
							startX -= internalPart.length * 5;
							startX -= previousPart.length * 5;
							svgString += super.renderPart(startX, midY, component, previousPart, colourIndex, colour);
							startX += internalPart.length * 5;
							startX += previousPart.length * 5;
						}
						previousPart = internalPart;
					}

					startX -= totalLength * 5;

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30  + totalLength * 5, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY);
					svgString += `<line x1="${startX + 10}" ` +
						`y1="${midY}" ` +
						`x2="${startX + 20}" ` +
						`y2="${midY - 10}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;
					svgString += `<line x1="${startX + 10}" ` +
						`y1="${midY}" ` +
						`x2="${startX + 20}" ` +
						`y2="${midY + 10}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX + 40 + totalLength * 5, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += `<line x1="${startX - 40}" ` +
						`y1="${midY + 50}" ` +
						`x2="${startX + 40  + totalLength * 5}" ` +
						`y2="${midY + 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += `<line x1="${startX - 30}" ` +
						`y1="${midY + 100}" ` +
						`x2="${startX - 20}" ` +
						`y2="${midY + 90}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;
					svgString += `<line x1="${startX - 30}" ` +
						`y1="${midY + 100}" ` +
						`x2="${startX - 20}" ` +
						`y2="${midY + 110}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;
				}
			} else {


				for (let part of component.parts) {
					svgString += super.renderPart(startX, midY, component, part, colourIndex, colour);

					colour = this.getMappedColour(part.colours, colourIndex, colour.colour);
					// TODO - why is the taper off
					svgString += super.renderTaper(startX, midY, part, colourIndex, colour.colour);

					startX += part.length * 5;
					partLength += part.length * 5;


					for (let internalEnd of component.internalEnd) {
						colour = this.getMappedColour(internalEnd.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, component, internalEnd, colourIndex, colour);
						startX += internalEnd.length * 5;
						endPartLength += internalEnd.length * 5;
					}
				}

				if (component.hasInternalEnd) {
					startX -= endPartLength;

					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "2.0", "white");
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX + 10, midY);

					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "2.0", "white");
					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "1.0", "#0f0f0f");


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX - 30, midY + 100);

					svgString += lineVertical(startX - 40, midY + 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;

				}

				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX - 30, midY);
					svgString += lineVertical(startX - 40, midY - 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;
					let totalLength: number = component.length;

					for (let internalPart of component.internalStart) {
						colour = this.getMappedColour(internalPart.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, component, internalPart, colourIndex, colour);
						totalLength += internalPart.length;
						startX += internalPart.length * 5
					}

					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "2.0", "white");
					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "1.0", "#0f0f0f");

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "2.0", "#ffffff");
					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY - 100);

					startX += partLength;
				}
			}
		}

		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		midY = 120;

		for (let [index, component] of this.pencil.components.entries()) {
			if((index !== 0 && component.hasInternalStart)) {
				midY += 120;
			}
		}

		return(svgString);
	}

}