import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
import {
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

export class SVGTechnicalExplodedRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
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
		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT += this.pencil.maxHeight
		for(const [index, component] of this.pencil.components.entries()) {
			if(component.hasInternalStart || component.hasInternalEnd) {
				this.SVG_HEIGHT += 120;
			}
		}

		let svgString:string = this.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT);



		// overview text
		svgString += this.renderOverviewText(false);

		// now it is time to render the details of the pencil

		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);

		return(svgString);
	}


	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = 120;

		let colour:string = "white";

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				// if we have an internal_start part, then increment the
				if(component.hasInternalStart) {
					midY += 100;
				}
			}

			colour = this.getMappedColour(component, colour, colourIndex);

			let partLength:number = 0;
			let endPartLength: number = 0;

			for(let part of component.parts) {
				svgString += super.renderPart(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
				partLength += part.length * 5;

				for(let internal of component.internalEnd) {
					svgString += super.renderPart(startX, midY, component, internal, colourIndex, colour);
					startX += internal.length * 5;
					endPartLength += internal.length * 5;
				}
			}

			if(component.hasInternalEnd) {
				startX -= endPartLength;

				// now draw the dotted line
				svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
				svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

				// and for the arrows
				svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "1.0", "#0f0f0f");
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

				svgString += lineVertical(startX + 40+ endPartLength, midY, 50, "1.0", "#0f0f0f");

				// in between the component line
				svgString += `<line x1="${startX - 40}" ` +
						`y1="${midY + 50}" ` +
						`x2="${startX + 40+ endPartLength}" ` +
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

			if(component.hasInternalStart) {
				startX -= partLength;

				for(let internalPart of component.internalStart) {
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
				let totalLength:number = component.length;

				for(let internalPart of component.internalStart) {
					svgString += super.renderPart(startX, midY, component, internalPart, colourIndex, colour);
					totalLength += internalPart.length;
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

				svgString += lineHorizontal(startX + 10, midY - 100 , 30, "1.0", "#0f0f0f");
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

				startX += partLength;
			}
		}

		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		midY = 120;

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0 && component.hasInternalStart) {
				midY += 120;
			}

			colour = this.getMappedColour(component, colour, colourIndex);

			for(let part of component.parts) {
				// TODO - why is the taper off
				svgString += super.renderTaper(startX, midY, part, colour);
				startX += part.length * 5;
			}

		}

		return(svgString);
	}

}