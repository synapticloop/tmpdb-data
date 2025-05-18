import {Part} from "../model/Part.ts";
import {
	dimensionsHorizontal,
	drawExtraBackground,
	drawExtraForeground,
	drawOutlineCircle,
	drawShapeDetails,
	drawText,
	drawTextBold, drawTextBoldCentred,
	lineHorizontal,
	lineVertical,
	lineVerticalGuide,
	rectangle,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";

import {Component} from "../model/Component.ts";
import {Pencil} from "../model/Pencil.ts";
import {formatToTwoPlaces} from "../utils/formatter.ts";

export abstract class SVGRenderer {
	protected pencil:Pencil;
	private _width: number;
	private _height: number;
	private _rendererName: string;

	protected constructor(pencil:Pencil, width: number, height: number, rendererName:string = "") {
		this.pencil = pencil;
		this._width = width;
		this._height = height;
		this._rendererName = rendererName;
	}

	protected resize(width: number, height: number): void {
		this._width = width;
		this._height = height;
	}

	abstract render(colourInder:number): string;

	private addOutlineBox(width: number, height: number, transparent:boolean):string {
		if(!transparent) {
			return(`<rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="4" />\n` +
				`<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="white" stroke="dimgray" stroke-width="1" />\n`);
		}
		return("");
	}

	protected getSvgStart(width: number, height: number, transparent:boolean=false, rotate:number=0): string {
		let svgString:string = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${width}" ` +
			`height="${height}">\n ` +
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
			this.addOutlineBox(width, height, transparent) +
			`<g transform="rotate(${rotate} ${(rotate !== 0 ? width/2 : 0)} ${(rotate !== 0 ? height/2 : 0)})">\n`;

		return(svgString);
	}

	protected getSvgEnd(width: number, height: number): string {
		// todo - need to switch on height
		if(width <= 1000) {
			return(`</g><text x="50%" y="${height - 40}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb)</text>\n` +
				`<text x="50%" y="${height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
				`<text x="${width - 10}" y="${height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
				`</svg>`);
		}

		let svgString: string = `</g><text x="50%" y="${height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
			`<text x="${width - 10}" y="${height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
			`</svg>`;

		return(svgString);
	}

	protected renderCentreLines(width: number, height: number, renderFront:boolean=true, renderBack:boolean=true): string {
		let svgString: string = "";

		// the horizontal centre line with targets
		svgString += lineHorizontal(10, height / 2, width - 20, "1", "#000000", "2");
		svgString += target(30, height / 2, 40, 10);
		svgString += target(width - 30, height / 2, 40, 10);

		if (renderFront) {
			// FRONT VIEW the left hand side targets and the dashed line
			svgString += lineVertical(160, 140, height - 220, "1", "#000000", "2");
			svgString += target(160, 150, 40, 10);
			svgString += target(160, height - 100, 40, 10);
		}

		// SIDE VIEW
		svgString += lineVertical(width / 2, 140, height - 220, "1", "#000000", "2");
		svgString += target(width / 2, 150, 40, 10);
		svgString += target(width / 2, height - 100, 40, 10);

		if (renderBack) {
			// BACK VIEW the right hand side targets and the dashed line
			svgString += lineVertical(width - 100, 140, height - 220, "1", "#000000", "2");
			svgString += target(width - 100, 150, 40, 10);
			svgString += target(width - 100, height - 100, 40, 10);
		}

		return(svgString);
	}

	protected renderOverviewText(full:boolean=true): string {
		let svgString = "";
		svgString += drawTextBold(`${this.pencil.brand}` +
			` // ` +
			`${this.pencil.model} ` +
			`${(this.pencil.modelNumber ? "(Model #: " + this.pencil.modelNumber + ")" : "")}`,
			30,
			50,
			"2.0em");

		if(full) {
			svgString += drawText(`${this.pencil.text}`, 30, 80, "1.1em");

			if (this.pencil.leadSize) {
				svgString += drawText(`Lead size: ${this.pencil.leadSize} mm`, 30, 100, "1.1em");
			}

			if (this.pencil.weight) {
				svgString += drawText(`Weight: ${this.pencil.weight}g`, 30, 120, "1.1em");
			}
		}

		return(svgString);
	}

	protected renderPencilColours(): string {
		let svgString:string = "";
		// lets draw the pencil colours

		let colourOffset:number = this._width - 60;

		svgString += `<text ` +
			`x="${colourOffset + 40}" ` +
			`y="30" ` +
			`font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
			`Colour variants of the ${this.pencil.colourComponent}` +
			`</text>\n`

		for(let colourComponent of this.pencil.colourComponents) {
			let fillColour = colourComponent;

			if (this.pencil.colourMap[colourComponent]) {
				fillColour = this.pencil.colourMap[colourComponent];
			}

			svgString += `<rect x="${colourOffset}" y="55" width="40" rx="50%" ry="50%" height="40" stroke="black" stroke-width="2" fill="${fillColour}" />\n`;
			svgString += `<text x="${colourOffset + 20}" ` +
				`y="100" ` +
				`transform="rotate(-90, ${colourOffset + 20}, 100)" ` +
				`font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
				`${colourComponent}` +
				`</text>\n`

			colourOffset -= 60;
		}

		return(svgString);
	}

	protected renderMaterialList(): string {
		let svgString:string = "";

		let offset:number = 136;
		svgString += `<text ` +
			`x="30" ` +
			`y="${offset}" ` +
			`font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
			`Materials:` +
			`</text>\n`

		offset += 20;

		for(const material of this.pencil.materials) {
			svgString += `<text ` +
				`x="50" ` +
				`y="${offset}" ` +
				`font-size="1.2em" text-anchor="start" dominant-baseline="central">` +
				` - ${material}` +
				`</text>\n`

			offset += 20;
		}
		return(svgString);
	}

	protected renderSectionTitles(): string {
		let svgString: string = "";
		// Front view heading
		svgString += drawTextBoldCentred("Front", 160, this._height - 60, "1.8em");
		// Side View Heading
		svgString += drawTextBoldCentred("Side view", this._width/2, this._height - 60, "1.8em");
		// Back View Heading
		svgString += drawTextBoldCentred("Back", this._width-100, this._height - 60, "1.8em");
		return(svgString);
	}

	protected renderTaper(startX:number, midY:number, part: Part, colour:string):string {
		// TODO - need a nice way to determine what shade of black/grey -
		//   thinking grayscale inverse
		let strokeColor:string = "black";
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

		if(part.taperStart) {
			// now we get to draw the taper
			switch (part.shape) {
				case "hexagonal":
					if(xOffsetStart < 0) {
						svgString += `<path d="M ${startX + 0.65} ${midY - part.endHeight / 2 * 5} ` +
							`C ${startX + xOffsetStart * xOffsetStartScale * 5} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX + xOffsetStart * xOffsetStartScale * 5} ${midY - part.endHeight / 2 * 5 / 4}, ` +
							`${startX + 0.65} ${midY}" ` +
							`stroke-width="0.5" stroke="${strokeColor}" stroke-linecap="round" fill="${colour}" />`
						svgString += `<path d="M ${startX + 0.65} ${midY + part.endHeight / 2 * 5} ` +
							`C ${startX + xOffsetStart * xOffsetStartScale * 5} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX + xOffsetStart * xOffsetStartScale * 5} ${midY + part.endHeight / 2 * 5 / 4}, ` +
							`${startX + 0.65} ${midY}" ` +
							`stroke-width="0.5" stroke="${strokeColor}" stroke-linecap="round" fill="${colour}" />`
					} else {
						svgString += `<path d="M ${startX + xOffsetStart * 5} ${midY - part.endHeight / 2 * 5} ` +
							`C ${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
							`${startX + xOffsetStart * 5} ${midY}" ` +
							`stroke-width="0.5" stroke="${strokeColor}" stroke-linecap="round" fill="${colour}" />`

						svgString += `<path d="M ${startX + xOffsetStart * 5} ${midY + part.endHeight / 2 * 5} ` +
							`C ${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
							`${startX - (xOffsetStart * xOffsetStartScale * 5)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
							`${startX + xOffsetStart * 5} ${midY}" ` +
							`stroke-width="0.5" stroke="${strokeColor}" stroke-linecap="round" fill="${colour}" />`

					}

					break;
			}
			return (svgString);
		}
	}

	protected renderSideDimensions(): string {
		let svgString: string = "";

		let startX: number = (this._width - this.pencil.totalLength * 5)/2;
		let midY: number = this._height/2;

		// render the component dimensions
		for (let component of this.pencil.components) {
			if(component.isHidden) {
				continue;
			}
			// draw all the dimensions
			svgString += dimensionsHorizontal(startX,
				midY - 120,
				component.length * 5,
				`${formatToTwoPlaces(component.length)} mm${(component.length * 5 > 30 ? "\n" : " ")}${component.type}`,
				TextOrientation.TOP_ROTATED,
				true);

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extra of component.extras) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(startX + extra.offset[0] * 5,
					midY - 80,
					extra.length * 5,
					`${formatToTwoPlaces(extra.length)} mm\n${component.type} (extra)`,
					TextOrientation.CENTER,
					true);
			}

			startX += component.length * 5;
		}

		return(svgString);
	}

	protected renderSideMaterials(): string {
		let svgString: string = "";

		let xOffset: number = (this._width - this.pencil.totalLength * 5)/2;
		for (let component of this.pencil.components) {
			if(component.isHidden) {
				continue;
			}

			// extra parts are always rendered first
			for(const extra of component.extras) {
				svgString += dimensionsHorizontal(
					xOffset + extra.offset[0] * 5,
					this._height/2 + 80,
					extra.length * 5,
					`${component.materials.join("\n")}`,
					TextOrientation.BOTTOM,
					false);
			}

			// draw all the dimensions
			svgString += dimensionsHorizontal(xOffset,
				this._height/2 + 120,
				component.length * 5,
				`${(component.materials.join("\n"))}`,
				TextOrientation.BOTTOM_ROTATED,
				false);

			xOffset += component.length * 5;
		}

		return(svgString);
	}

	protected renderSideComponents(colourIndex:number, midYOverride: number=null): string {
		let svgString: string = "";
		let startX: number = this._width/2 - (this.pencil.totalLength*5/2);
		let midY: number = this._height/2;

		if(null != midYOverride) {
			midY = midYOverride;
		}

		let colour:string = "white";


		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component.colours, colourIndex, colour);

			for(let part of component.parts) {
				svgString += this.renderPart(startX, midY, component, part, colourIndex, colour);
				startX += part.length * 5;
			}
		}


		// reset to draw the taper lines last
		startX = this._width/2 - (this.pencil.totalLength*5/2);

		for (let component of this.pencil.components) {
			colour = this.getMappedColour(component.colours, colourIndex, colour);

			for(let part of component.parts) {
				svgString += this.renderTaper(startX, midY, part, colour);
				startX += part.length * 5;
			}
		}

		return(svgString);
	}

	protected renderExtraComponentsBackground(midYOverride: number, colourIndex: number):string {
		let svgString: string = "";
		let startX: number = this._width/2 - (this.pencil.totalLength*5/2);
		for (const component of this.pencil.components) {
			// extras are always rendered first - we render
			// the background for it
			for(const extra of component.extras) {
				let backgroundColour = "black";
				if(component.colours[colourIndex] == "black") {
					backgroundColour = "dimgray";
				}
				svgString += drawExtraBackground(startX + extra.offset[0] * 5, midYOverride - extra.offset[1] * 5, extra.extraParts, backgroundColour);
				break;
			}

			for(let part of component.parts) {
				startX += part.length * 5;
			}
		}
		return(svgString);
	}

	protected renderExtraComponentsForeground(colourIndex:number, midYOverride: number):string {
		let svgString: string = "";
		let startX: number = this._width/2 - (this.pencil.totalLength*5/2);
		for (const component of this.pencil.components) {
			// extras are always rendered first - we render
			// the background for it
			for(const extra of component.extras) {
				let colour: string = this.getMappedColour(component.colours, colourIndex, extra.colours[colourIndex]);
				svgString += drawExtraForeground(startX + extra.offset[0] * 5, midYOverride - extra.offset[1] * 5, extra.extraParts, colour);
				break;
			}

			for(let part of component.parts) {
				startX += part.length * 5;
			}
		}
		return(svgString);
	}

	protected renderTotalLengthDimensions(): string {
		return(dimensionsHorizontal(
			this._width/2 - this.pencil.totalLength*5/2,
			this._height/2 + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength * 5,
			`${formatToTwoPlaces(this.pencil.totalLength)} mm`,
			TextOrientation.CENTER,
			true
		));
	}

	protected renderPart(startX:number, midY:number, component:Component, part: Part, colourIndex: number, colour: string):string {

		let svgString:string = "";
		// get the stroke colour
		let strokeColour:string = "black"
		if (component.colours[colourIndex] === "black") {
			strokeColour = "dimgray";
		}

		for(const extra of component.extras) {
			let backgroundColour = "black";
			if(component.colours[colourIndex] == "black") {
				backgroundColour = "dimgray";
			}
			svgString += drawExtraBackground(startX + extra.offset[0] * 5, midY - extra.offset[1] * 5, extra.extraParts, backgroundColour);
			break;
		}

		// maybe we have an over-ride colour and material
		colour = this.getMappedColour(component.colours, colourIndex, colour);

		switch (part.shape) {
			case "cylinder":
			case "hexagonal":
			case "octagonal":
				svgString += rectangle(
					startX + part.internalOffset * 5,
					midY - (part.endHeight / 2 * 5),
					part.length * 5,
					part.startHeight * 5,
					strokeColour,
					colour);

				break;
			case "cone":
				svgString += `<path d="M${startX + part.internalOffset * 5} ` +
					`${midY - (part.startHeight / 2 * 5)} ` +
					`L${startX + part.internalOffset * 5 + part.length * 5} ${midY - (part.endHeight / 2 * 5)} ` +
					`L${startX + part.internalOffset * 5 + part.length * 5} ${midY + (part.endHeight / 2 * 5)} ` +
					`L${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)} Z" ` +
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

				svgString += `<path d="M${startX + part.internalOffset * 5} ${midY - (part.startHeight / 2 * 5)} ` +
					`Q${startX + part.internalOffset * 5 + offsetX} ${midY - offsetY} ` +
					`${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${colour}"/>\n`
				break;
			case "concave":
				svgString += `<path d="M${startX + part.internalOffset * 5} ${midY - (part.startHeight / 2 * 5)} ` +
					`Q${startX + part.internalOffset * 5 + part.length * 5} ${midY} ` +
					`${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${colour}"/>\n`
				break;
		}

		switch (part.shape) {
			case "hexagonal":
				svgString += drawShapeDetails(startX + part.internalOffset * 5, midY, (part.length) * 5);
				break;
			case "octagonal":
				svgString += drawShapeDetails(startX + part.internalOffset * 5, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
				svgString += drawShapeDetails(startX + part.internalOffset * 5, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
				break;
		}

		// now for the finish - although this only really works for cylinder types
		// the question becomes whether there will be other finishes on different
		// objects
		for(const finish of part.finish.split(",")) {
			switch (finish) {
				case "ferrule":
					let offset = ((part.length / 13) * 5) / 2;

					for (let i = 0; i < 13; i++) {
						if (i !== 0 && i !== 6 && i < 12) {
							svgString += `<line x1="${startX + part.internalOffset * 5 + offset}" ` +
								`y1="${midY + 1.0 - part.startHeight / 2 * 5}" ` +
								`x2="${startX + part.internalOffset * 5 + offset}" ` +
								`y2="${midY - 1.0 + part.startHeight / 2 * 5}" ` +
								`stroke-width="1" stroke="gray" />\n`
						}
						offset += (part.length / 13) * 5;
					}

					svgString += drawOutlineCircle(4, startX + part.internalOffset * 5 + 15, midY - part.startHeight / 4 * 5, "dimGray")

					break;
				case "knurled":
					svgString += `<rect x="${startX + part.internalOffset * 5}" ` +
						`y="${midY - (part.endHeight / 2 * 5)}" ` +
						`width="${part.length * 5}" ` +
						`height="${part.startHeight * 5}" ` +
						`rx="1" ry="1" stroke-width="0.5" stroke="black" fill="url(#diagonalHatch)"/>\n`;
					break;
				case "spring":

					svgString += `<rect x="${startX + part.internalOffset * 5 + 5}" ` +
						`y="${midY - (part.endHeight / 2 * 5) - 5}" ` +
						`width="${part.length * 5 - 10}" ` +
						`height="${part.startHeight * 5 + 10}" ` +
						`stroke-width="0.0" stroke="black" fill="url(#spring)"/>\n`
					for (let i:number = 0; i < 4; i++) {
						svgString += `<line x1="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;

						svgString += `<line x1="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;

					}
					break;

				case "threaded":
					for (let i:number = 0; i < part.length; i++) {
						if((i + 1) > part.length) {
							// TODO - half a line
							break;
						}
						svgString += `<line x1="${startX + part.internalOffset * 5 + i*5}" y1="${midY - (part.endHeight / 2 * 5) - 2}" ` +
							`x2="${startX + part.internalOffset * 5 + (i + 1) * 5}" y2="${midY + (part.endHeight / 2 * 5) + 2}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${startX + part.internalOffset * 5 + i*5}" y1="${midY - (part.endHeight / 2 * 5) - 2}" ` +
							`x2="${startX + part.internalOffset * 5 + (i + 1) * 5}" y2="${midY + (part.endHeight / 2 * 5) + 2}" stroke="${colour}" stroke-linecap="round" stroke-width="1" />\n`;
					}
					break;
				case "indicator":
					// now draw the indicator
					svgString += `<rect x="${startX + part.internalOffset * 5 + 10}" ` +
							`y="${midY - (part.endHeight / 4 * 5)}" ` +
							`width="${part.length * 5 - 20}" ` +
							`height="${part.startHeight / 2 * 5}" ` +
							`rx="1" ry="1" stroke-width="2" stroke="black" fill="${colour}"/>\n`;
					svgString += `<text x="${startX + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
							`y="${midY}" ` +
							`text-anchor="middle" dominant-baseline="central">` +
							`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
							`HB` +
							`</tspan>` +
							`</text>`;
					break;
			}
		}

		for(const extra of component.extras) {
			let colour: string = this.getMappedColour(component.colours, colourIndex, extra.colours[colourIndex]);
			svgString += drawExtraForeground(startX + extra.offset[0] * 5, midY - extra.offset[1] * 5, extra.extraParts, colour);
			break;
		}

		return(svgString);
	}

	// TODO remove
	protected getMappedColourToBeRemoved(component: Component, defaultColour: string, colourIndex: number): string {
		let colourComponent:string = component.colours[colourIndex];
		if (colourComponent) {
			if(this.pencil.colourMap[colourComponent]) {
				return(this.pencil.colourMap[colourComponent]);
			} else {
				return(colourComponent);
			}
		}

		return(defaultColour);
	}

	// TODO - this should be renamed to getMappedColour
	protected getMappedColour(colours: string[], colourIndex: number, defaultColour: string ): string {
		if(colourIndex == -1) {
			return("white");
		}

		let colourComponent:string = colours[colourIndex];

		if (colourComponent) {
			if(this.pencil.colourMap[colourComponent]) {
				return(this.pencil.colourMap[colourComponent]);
			} else {
				return(colourComponent);
			}
		}

		return(defaultColour);
	}

	protected renderGuidelines(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number;


		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = this._width/2 - this.pencil.totalLength*5/2;

		svgString += lineVerticalGuide(offset, this._height/2 - 88 - this.pencil.maxHeight/2 * 5, 140 + this.pencil.maxHeight/2 * 5);

		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, this._height/2 - 120, 120);

			offset += component.length * 5;

			// now for extraParts
			for(const extra of component.extras) {
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5,
						this._height/2 - 80,
						80);
				svgString += lineVerticalGuide(offset + extra.offset[0] * 5 + extra.length * 5,
						this._height/2 - 80,
						80);
			}
		}

		svgString += lineVerticalGuide(offset, this._height/2 - 88 - this.pencil.maxHeight/2 * 5, 140 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}

}