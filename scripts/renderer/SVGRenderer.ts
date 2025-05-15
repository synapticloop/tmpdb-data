import {Part} from "../model/Part.ts";
import {drawExtra, drawOutlineCircle, drawShapeDetails, rectangle} from "../utils/svg-helper.ts";
import {Component} from "../model/Component.ts";
import {Pencil} from "../model/Pencil.ts";

export abstract class SVGRenderer {
	protected pencil:Pencil;

	constructor(pencil:Pencil) {
		this.pencil = pencil;
	}

	abstract render(colourInder:number): string;

	protected renderPart(
			startX:number,
			midY:number,
			component:Component,
			part: Part,
			colourIndex:number,
			colour:string):string {

		let svgString:string = "";
		// get the stroke colour
		let strokeColour:string = "black"
		if (component.colours[0] === "black") {
			strokeColour = "#888888";
		}

		// maybe we have an over-ride colour and material
		const partColour:string = part.colours[colourIndex];
		if (partColour) {
			if (this.pencil.colourMap[partColour]) {
				colour = this.pencil.colourMap[partColour];
			} else {
				colour = partColour;
			}
		}

		switch (part.type) {
			case "cylinder":
			case "hexagonal":
			case "octagonal":
				svgString += rectangle(
					startX,
					midY - (part.endHeight / 2 * 5),
					part.length * 5,
					part.startHeight * 5,
					strokeColour,
					colour);
				svgString += this.drawTaper(startX, midY, component, part, colourIndex, colour);
				break;
			case "cone":
				svgString += `<path d="M${startX} ` +
					`${midY - (part.startHeight / 2 * 5)} ` +
					`L${startX + part.length * 5} ${midY - (part.endHeight / 2 * 5)} ` +
					`L${startX + part.length * 5} ${midY + (part.endHeight / 2 * 5)} ` +
					`L${startX} ${midY + (part.startHeight / 2 * 5)} Z" ` +
					`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${colour}" />\n`
				break;
			case "convex":
				let offsetX = part.length * 5;
				if (part.offset[0] !== 0) {
					offsetX = part.offset[0] * 5;
				}

				let offsetY = part.startHeight / 2 * 5;
				if (part.offset[1] !== 0) {
					offsetY = (part.startHeight / 2 - part.offset[1]) * 5;
				}

				svgString += `<path d="M${startX} ${midY - (part.startHeight / 2 * 5)} ` +
					`Q${startX + offsetX} ${midY - offsetY} ` +
					`${startX} ${midY + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${colour}"/>\n`
				break;
			case "concave":
				svgString += `<path d="M${startX} ${midY - (part.startHeight / 2 * 5)} ` +
					`Q${startX + part.length * 5} ${midY} ` +
					`${startX} ${midY + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${colour}"/>\n`
				break;
			case "extra":
				svgString += drawExtra(startX + part.extraOffset[0] * 5, midY - part.extraOffset[1] * 5, part.extraParts, colour);
				break;
		}

		switch (part.type) {
			case "hexagonal":
				svgString += drawShapeDetails(startX, midY, (part.length) * 5);
				break;
			case "octagonal":
				svgString += drawShapeDetails(startX, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
				svgString += drawShapeDetails(startX, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
				break;
		}

		// now for the finish - although this only really works for cylinder types
		// the question becomes whether there will be other finishes on different
		// objects
		switch (part.finish) {
			case "ferrule":
				let offset = ((part.length / 13) * 5) / 2;

				for (let i = 0; i < 13; i++) {
					if (i !== 0 && i !== 6 && i < 12) {
						svgString += `<line x1="${startX + offset}" ` +
							`y1="${midY + 1.0 - part.startHeight / 2 * 5}" ` +
							`x2="${startX + offset}" ` +
							`y2="${midY - 1.0 + part.startHeight / 2 * 5}" ` +
							`stroke-width="1" stroke="gray" />\n`
					}
					offset += (part.length / 13) * 5;
				}

				svgString += drawOutlineCircle(4, startX + 15, midY - part.startHeight / 4 * 5, "dimGray")

				break;
			case "knurled":
				svgString += `<rect x="${startX}" ` +
					`y="${midY - (part.endHeight / 2 * 5)}" ` +
					`width="${part.length * 5}" ` +
					`height="${part.startHeight * 5}" ` +
					`rx="1" ry="1" stroke-width="0.5" stroke="black" fill="url(#diagonalHatch)"/>\n`
				break;
		}

		switch (component.type) {
			case "indicator":
				// now draw the indicator
				svgString += `<rect x="${startX + 10}" ` +
					`y="${midY - (part.endHeight / 4 * 5)}" ` +
					`width="${part.length * 5 - 20}" ` +
					`height="${part.startHeight / 2 * 5}" ` +
					`rx="1" ry="1" stroke-width="2" stroke="black" fill="${colour}"/>\n`;
				svgString += `<text x="${startX + (part.length * 5) / 2}" ` +
					`y="${midY}" ` +
					`text-anchor="middle" dominant-baseline="central">` +
					`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
					`HB` +
					`</tspan>` +
					`</text>`;
				break;
		}
		return(svgString);
	}

	private drawTaper(startX:number, midY:number, component:Component, part: Part, colourIndex:number, colour:string):string {
		let svgString:string = "";
		if(!(part.taperStart || part.taperEnd)){
			return("");
		}

		let xOffsetStart: number = 0;
		let xOffsetStartScale: number = 1;

		if(part.taperStart?.offset[0]) {
			xOffsetStart = part.taperStart.offset[0];
		}
		if(part.taperStart?.offset[1]) {
			xOffsetStartScale = part.taperStart.offset[1];
		}

		let xOffsetEnd: number = 0;
		let xOffsetEndScale: number = 1;

		if(part.taperEnd?.offset[0]) {
			xOffsetEnd = part.taperEnd.offset[0];
		}
		if(part.taperEnd?.offset[1]) {
			xOffsetEndScale = part.taperEnd.offset[1];
		}

		if(part.taperStart) {
			// now we get to draw the taper
			switch (part.type) {
				case "hexagonal":
					if(xOffsetStart < 0) {
						svgString += `<path d="M ${startX + 0.5} ${midY - part.endHeight / 2 * 5} ` +
							`C ${startX + xOffsetStart * xOffsetStartScale * 5} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX + xOffsetStart * xOffsetStartScale * 5} ${midY - part.endHeight / 2 * 5 / 4}, ` +
							`${startX + 0.5} ${midY}" ` +
							`stroke-width="0.5" stroke="black" stroke-linecap="round" fill="${colour}" />`
						svgString += `<path d="M ${startX + 0.5} ${midY + part.endHeight / 2 * 5} ` +
							`C ${startX + xOffsetStart * xOffsetStartScale * 5} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX + xOffsetStart * xOffsetStartScale * 5} ${midY + part.endHeight / 2 * 5 / 4}, ` +
							`${startX + 0.5} ${midY}" ` +
							`stroke-width="0.5" stroke="black" stroke-linecap="round" fill="${colour}" />`
					} else {
						svgString += `<path d="M ${startX + xOffsetStart * 5} ${midY - part.endHeight / 2 * 5} ` +
							`C ${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
							`${startX + xOffsetStart * 5} ${midY}" ` +
							`stroke-width="0.5" stroke="black" stroke-linecap="round" fill="${colour}" />`

						svgString += `<path d="M ${startX + xOffsetStart * 5} ${midY + part.endHeight / 2 * 5} ` +
							`C ${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
							`${startX + xOffsetStart * 5} ${midY}" ` +
							`stroke-width="0.5" stroke="black" stroke-linecap="round" fill="${colour}" />`

					}

					break;
			}
			return (svgString);
		}
	}
}