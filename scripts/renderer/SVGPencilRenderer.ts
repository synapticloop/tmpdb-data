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
	lineVerticalGuide,
	renderBackExtra,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";

export class SVGPencilRenderer extends SVGRenderer {
	static SVG_WIDTH = 1000;
	static SVG_HEIGHT = 200;

	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
		`width="${SVGPencilRenderer.SVG_WIDTH}" ` +
		`height="${SVGPencilRenderer.SVG_HEIGHT}">\n` +
		`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
		`<rect width="6" height="6" fill='none'/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
		`</pattern>\n`
	;

	static SVG_END = `<text x="50%" y="${SVGPencilRenderer.SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
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
		let svgString:string = SVGPencilRenderer.SVG_START;

		// now it is time to render the details of the pencil
		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += SVGPencilRenderer.SVG_END;
		return(svgString);
	}

	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = SVGPencilRenderer.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = SVGPencilRenderer.SVG_HEIGHT/2;

		let colour = "white";

		for (let component of this.pencil.components) {
			let colourComponent:string = component.colours[colourIndex];
			if (colourComponent) {
				if(this.pencil.colourMap[colourComponent]) {
					colour = this.pencil.colourMap[colourComponent];
				} else {
					colour = colourComponent;
				}
			}

			for(let part of component.parts) {
				// get the stroke colour
				let strokeColour = "black"
				if(component.colours[0] === "black") {
					strokeColour = "dimgray";
				}

				// maybe we have an over-ride colour and material
				const partColour = part.colours[colourIndex];
				if(partColour) {
					if(this.pencil.colourMap[partColour]) {
						colour = this.pencil.colourMap[partColour];
					} else {
						colour = partColour;
					}
				}

				switch (part.type) {
					case "cylinder":
					case "hexagonal":
					case "octagonal":
						svgString += `<rect x="${startX}" ` +
							`y="${midY - (part.endHeight/2 * 5)}" ` +
							`width="${part.length * 5}" ` +
							`height="${part.startHeight * 5}" ` +
							`rx="1" ry="1" stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "cone":
						svgString += `<path d="M${startX} ` +
							`${midY - (part.startHeight/2 * 5)} ` +
							`L${startX + part.length * 5} ${midY - (part.endHeight/2 * 5)} ` +
							`L${startX + part.length * 5} ${midY + (part.endHeight/2 * 5)} ` +
							`L${startX} ${midY + (part.startHeight/2 *5)} Z" ` +
							`stroke-width="1" stroke="${strokeColour}" fill="${colour}" />\n`
						break;
					case "convex":
						let offsetX = part.length *5;
						if(part.offset[0] !== 0) {
							offsetX = part.offset[0] * 5;
						}

						let offsetY = part.startHeight/2 * 5;
						if(part.offset[1] !== 0) {
							offsetY = (part.startHeight/2 - part.offset[1]) * 5;
						}

						svgString += `<path d="M${startX} ${midY - (part.startHeight/2 * 5)} ` +
							`Q${startX + offsetX} ${midY - offsetY} ` +
							`${startX} ${midY + (part.startHeight/2 * 5)}" ` +
							`stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "concave":
						svgString += `<path d="M${startX} ${midY - (part.startHeight/2 * 5)} ` +
							`Q${startX + part.length*5} ${midY} ` +
							`${startX} ${midY + (part.startHeight/2 * 5)}" ` +
							`stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "extra":
						svgString += drawExtra(startX + part.extraOffset[0]*5, midY - part.extraOffset[1]*5, part.extraParts, colour);
						break;
				}

				// draw the additional details
				switch(part.type) {
					case "hexagonal":
						svgString += drawShapeDetails(startX, midY, part.length *5);
						break;
					case "octagonal":
						svgString += drawShapeDetails(startX, midY - ((part.startHeight/2 * 5)*4/7), part.length *5);
						svgString += drawShapeDetails(startX, midY + ((part.startHeight/2 * 5)*4/7), part.length *5);
						break;
				}

				// now for the finish - although this only really works for cylinder types
				// the question becomes whether there will be other finishes on different
				// objects
				switch(part.finish) {
					case "ferrule":
						let offset = ((part.length/13) * 5)/2;

						for(let i = 0; i < 13; i++) {
							if(i !== 0 && i !== 6 && i < 12) {
								svgString += `<line x1="${startX + offset}" ` +
									`y1="${midY + 1.0 - part.startHeight/2 * 5}" ` +
									`x2="${startX + offset}" ` +
									`y2="${midY - 1.0 + part.startHeight/2 * 5}" ` +
									`stroke-width="1" stroke="gray" />\n`
							}
							offset += (part.length/13) * 5;
						}

						svgString += drawOutlineCircle(4, startX + 15, midY - part.startHeight/4 * 5, "dimGray")

						break;
					case "knurled":
						svgString += `<rect x="${startX}" ` +
							`y="${midY - (part.endHeight/2 * 5)}" ` +
							`width="${part.length * 5}" ` +
							`height="${part.startHeight * 5}" ` +
							`rx="1" ry="1" stroke-width="0.5" stroke="black" fill="url(#diagonalHatch)"/>\n`
						break;
				}

				switch(component.type) {
					case "indicator":
						// now draw the indicator
						svgString += `<rect x="${startX + 10}" ` +
							`y="${midY - (part.endHeight/4 * 5)}" ` +
							`width="${part.length * 5 - 20}" ` +
							`height="${part.startHeight/2 * 5}" ` +
							`rx="1" ry="1" stroke-width="2" stroke="black" fill="${colour}"/>\n`;
						svgString += `<text x="${startX + (part.length * 5)/2}" ` +
							`y="${midY}" ` +
							`text-anchor="middle" dominant-baseline="central">` +
							`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
							`HB` +
							`</tspan>` +
							`</text>`;
						break;
				}
				startX += part.length * 5;
			}
		}
		return(svgString);
	}
}