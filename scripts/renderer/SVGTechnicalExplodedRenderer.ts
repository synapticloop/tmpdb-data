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
			if(component.hasInternal || component.hasEndInternal) {
				this.SVG_HEIGHT += 120;
			}
		}

		let svgString:string = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${this.SVG_WIDTH}" ` +
			`height="${this.SVG_HEIGHT}">\n` +
			`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
			`</pattern>\n` +
			`<pattern id="spring" patternUnits="userSpaceOnUse" width="8" height="100">\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="2" d="M 0,0 L 8,100"/>\n` +
			`<path stroke="white" stroke-linecap="round" stroke-width="1" d="M 0,0 L 8,100"/>\n` +
			`</pattern>\n` +
			`<rect x="0" y="0" width="${this.SVG_WIDTH}" height="${this.SVG_HEIGHT}" fill="white" stroke="black" stroke-width="4" />\n` +
			`<rect x="2" y="2" width="${this.SVG_WIDTH - 4}" height="${this.SVG_HEIGHT - 4}" fill="white" stroke="dimgray" stroke-width="1" />\n`;



		// centre line
		// svgString += this.renderCentreLines(SVGExplodedTechnicalRenderer.this.SVG_WIDTH, SVGExplodedTechnicalRenderer.this.SVG_HEIGHT);

		// overview text
		svgString += this.renderOverviewText(false);

		// now it is time to render the details of the pencil

		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += `<text x="50%" y="${this.SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
			`</svg>\n`;

		return(svgString);
	}


	private renderGuidelines(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number;

		let hasExtra = false;
		// now for the extra side components guidelines
		for (let component of this.pencil.components) {
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance top of the extra parts
				const y = this.SVG_HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5;

				svgString += lineHorizontalGuide(100, y, this.SVG_WIDTH - 200);
				// draw the straight-through line for guidance bottom of the extra parts
				svgString += lineHorizontalGuide(160, this.SVG_HEIGHT/2 - extraPart.extraOffset[1] * 5, this.SVG_WIDTH - 260);
				// guidelines for the extra width - left side
				svgString += lineVerticalGuide(160 - extraPart.extraWidth/2 * 5, this.SVG_HEIGHT/2 - 70, 70);
				// guidelines for the extra width - right side
				svgString += lineVerticalGuide(160 + extraPart.extraWidth/2 * 5, this.SVG_HEIGHT/2 - 70, 70);

				hasExtra = true;
			}
		}

		// FRONT VIEW GUIDELINES

		// top horizontal line
		svgString += lineHorizontalGuide((hasExtra ? 160 : 100), this.SVG_HEIGHT/2 - this.pencil.maxHeight/2 * 5, this.SVG_WIDTH - 100 - (hasExtra ? 160 : 100));

		// bottom line of full pencil
		svgString += lineHorizontalGuide(100, this.SVG_HEIGHT/2 + this.pencil.maxHeight/2 * 5, this.SVG_WIDTH - 200);

		// Vertical line of width - left
		svgString += lineVerticalGuide(160 - this.pencil.maxWidth/2 * 5,
			this.SVG_HEIGHT/2,
			20 + this.pencil.maxHeight/2 * 5);
		// Vertical line of width - right
		svgString += lineVerticalGuide(160 + this.pencil.maxWidth/2 * 5,
			this.SVG_HEIGHT/2,
			20 + this.pencil.maxHeight/2 * 5);

		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = this.SVG_WIDTH/2 - this.pencil.totalLength * 5/2;


		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 120, 240);

			offset += component.length * 5;

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.length * 5 : 0),
					this.SVG_HEIGHT/2 - 80,
					160);
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 + extraPart.extraLength * 5 - (component.extraPartFirst ? component.length * 5 : 0),
					this.SVG_HEIGHT/2 - 80,
					160);
			}
		}

		svgString += lineVerticalGuide(offset, this.SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 208);
		return(svgString);
	}



	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = 120;

		let colour = "white";

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				// if we have an internal part, then increment the
				if(component.hasInternal) {
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

				for(let internal of component.endInternals) {
					svgString += super.renderPart(startX, midY, component, internal, colourIndex, colour);
					startX += internal.length * 5;
					endPartLength += internal.length * 5;
				}
			}

			if(component.hasEndInternal) {
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

			if(component.hasInternal) {
				startX -= partLength;

				for(let internalPart of component.internals) {
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

				for(let internalPart of component.internals) {
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
			if(index !== 0 && component.hasInternal) {
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