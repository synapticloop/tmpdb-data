import {Part} from "../../model/Part.ts";
import {
	circle,
	dimensionsHorizontal,
	dimensionsVertical,
	drawExtraBackground,
	drawExtraForeground,
	drawOutlineCircle,
	drawOutlineHexagon,
	drawOutlineOctagon,
	drawShapeDetails,
	drawText,
	drawTextBold,
	drawTextBoldCentred,
	lineHorizontal,
	lineJoined,
	lineVertical,
	lineVerticalGuide,
	rectangle,
	renderExtra,
	target,
	TextOrientation
} from "../../utils/svg-helper.ts";
import {formatToTwoPlaces} from "../../utils/formatter.ts";

import {Component} from "../../model/Component.ts";
import {Pencil} from "../../model/Pencil.ts";
import {OpaqueColour} from "../../model/OpaqueColour.ts";
import {Extra} from "../../model/Extra.ts";
import {Pattern} from "../../model/Pattern.ts";
import {listFiles} from "../../utils/filesystem.ts";
import fs from "fs";
import {ObjectMapper} from "json-object-mapper";


export abstract class SVGRenderer {
	static inBuiltPatternMap: Map<string, Pattern> = new Map();
	static defaultPatternLoaded: boolean = false;

	private patternMap: Map<string, Pencil> = new Map();

	protected pencil: Pencil;
	protected _width: number;
	protected _height: number;

	private readonly _rendererName: string;

	static loadDefaultPatterns(): void {
		// load all the patterns
		for (const listFile of listFiles("./patterns")) {
			const patternName: string = listFile.substring(0, listFile.lastIndexOf("."));
			const pattern: Pattern = ObjectMapper.deserialize(Pattern, JSON.parse(fs.readFileSync("./patterns/" + listFile, "utf8")));
			console.log(`Statically loaded pattern ${listFile} (${pattern.name} - ${pattern.description})`);
			this.inBuiltPatternMap.set(patternName, pattern);
		}
		this.defaultPatternLoaded = true;
	}

	protected constructor(pencil:Pencil, width: number, height: number, rendererName:string = "") {
		if(!SVGRenderer.defaultPatternLoaded) {
			SVGRenderer.loadDefaultPatterns();
		}

		this.pencil = pencil;
		this._width = width;
		this._height = height;
		this._rendererName = rendererName;
	}

	public abstract render(colourInder:number): string;

	/**
	 * Resize the SVG - this is used when the size of the SVG is dynamically calculated,
	 * e.g. when multiple pencils will be drawn based on colour.
	 *
	 * @param width The new width for the SVG
	 * @param height The new height for the SVG
	 *
	 * @protected
	 */
	protected resize(width: number, height: number): void {
		this._width = width;
		this._height = height;
	}

	private addOutlineBox(width: number, height: number, transparent:boolean):string {
		if(!transparent) {
			return(`<rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="4" />\n` +
				`<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="white" stroke="dimgray" stroke-width="1" />\n`);
		}
		return("");
	}

	protected getSvgStart(transparent:boolean=false, rotate:number=0): string {
		let svgString:string = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${this._width}" ` +
			`height="${this._height}">\n `;

		for(const pattern of SVGRenderer.inBuiltPatternMap.values()) {
			svgString += pattern.pattern.join("\n");
		}

		svgString += this.addOutlineBox(this._width, this._height, transparent) +
			`<g transform="rotate(${rotate} ${(rotate !== 0 ? this._width/2 : 0)} ${(rotate !== 0 ? this._height/2 : 0)})">\n`;

		return(svgString);
	}

	protected getSvgEnd(): string {
		// TODO - need to determine the height
		if(this._width <= 1400) {
			return(`</g><text x="50%" y="${this._height - 40}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // Synapticloop and The Mechanical Pencil Database (tmpdb)</text>\n` +
				`<text x="50%" y="${this._height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
				`<text x="${this._width - 10}" y="${this._height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
				`</svg>`);
		}

		let svgString: string = `</g><text x="50%" y="${this._height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // Synapticloop and The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
			`<text x="${this._width - 10}" y="${this._height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
			`</svg>`;

		return(svgString);
	}

	protected renderCentreLineHorizontal(y:number, xInsetLeft: number=40, xInsetRight: number=40): string {
		let svgString: string = "";
		svgString += lineHorizontal(xInsetLeft, y, this._width - xInsetLeft - xInsetRight, "1", "#5f5f5f", "2");
		svgString += target(xInsetLeft, y, 40, 10);
		svgString += target(this._width - xInsetRight, y, 40, 10);
		return(svgString);
	}

	protected renderCentreLineVertical(x:number, yInsetTop: number=40, yInsetBottom: number=40): string {
		let svgString: string = "";
		svgString += lineVertical(x, yInsetTop, this._height - yInsetTop - yInsetBottom, "1", "#5f5f5f", "2");
		svgString += target(x, yInsetTop, 40, 10);
		svgString += target(x, this._height - yInsetBottom, 40, 10);
		return(svgString);
	}

	protected renderOverviewText(full:boolean=true): string {
		let svgString = "";
		svgString += drawTextBold(`${this.pencil.brand}` +
			` // ` +
			`${this.pencil.modelName} ` +
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
			svgString += `<rect x="${colourOffset}" y="55" width="40" rx="50%" ry="50%" height="40" stroke="black" stroke-width="2" fill="${colourComponent.colour}" fill-opacity="${colourComponent.opacity}"/>\n`;
			svgString += `<text x="${colourOffset + 20}" ` +
				`y="100" ` +
				`transform="rotate(-90, ${colourOffset + 20}, 100)" ` +
				`font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
				`${colourComponent.colourName}` +
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

	protected renderTaper(startX:number, midY:number, part: Part, colourIndex: number):string {

		let svgString:string = "";

		// no point doing anything if there is no taper
		if(!(part.taperStart || part.taperEnd)){
			return("");
		}

		let opaqueColour: OpaqueColour = part.getOpacityColour(colourIndex);
		let strokeColor:string = "black";

		// TODO - need a nice way to determine what shade of black/grey -
		//   thinking grayscale inverse

		if(opaqueColour.colourName === "black") {
			strokeColor = "gray";
		}


		let xOffsetTaperStart: number = 0;
		let xOffsetTaperStartScale: number = 1;

		if(part.taperStart?.xOffset) {
			xOffsetTaperStart = part.taperStart.xOffset;
		}

		if(part.taperStart?.xScale) {
			xOffsetTaperStartScale = part.taperStart.xScale;
		}


		if(part.taperStart) {
			let backgroundColour: OpaqueColour = part.taperStart.getBackgroundOpacityColour(colourIndex);
			svgString += `\n<!-- TAPER START: ${part.shape} -->\n`

			// now we get to draw the taper
			switch (part.shape) {
				case "hexagonal":
					// Draw the intersection of the path

					// TODO - should be an intersection
					// svgString += rectangle(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
					svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY - part.endHeight / 2 * 5} ` +
						`C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
						`${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
						`${startX + xOffsetTaperStart * 5} ${midY}" ` +
						`stroke-width="1.0" ` +
						`stroke="${strokeColor}" ` +
						`stroke-linecap="round" ` +
						`fill-opacity="${opaqueColour.opacity}" ` +
						`fill="none" />`
					svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY + part.endHeight / 2 * 5} ` +
						`C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
						`${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
						`${startX + xOffsetTaperStart * 5} ${midY}" ` +
						`stroke-width="1.0" stroke="${strokeColor}" stroke-linecap="round" ` +
						`fill-opacity="${opaqueColour.opacity}" ` +
						`fill="none" />`

					break;
				case "cylinder":
					svgString += rectangle(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
					svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY - part.endHeight / 2 * 5} ` +
						`C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight/2 * 5}, ` +
						`${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight/2 * 5}, ` +
						`${startX + xOffsetTaperStart * 5} ${midY + part.endHeight / 2 * 5}" ` +
						`stroke-width="1.0" ` +
						`stroke="${strokeColor}" ` +
						`stroke-linecap="round" ` +
							`fill-opacity="${opaqueColour.opacity}" ` +
							`fill="${opaqueColour.colour}" />`;
					break;
			}
		}

		let xOffsetTaperEnd: number = 0;
		let xOffsetTaperEndScale: number = 1;

		if(part.taperEnd?.xOffset) {
			xOffsetTaperEnd = part.taperEnd.xOffset;
		}
		if(part.taperEnd?.xScale) {
			xOffsetTaperEndScale = part.taperEnd.xScale;
		}

		if(part.taperEnd) {
			let backgroundColour: OpaqueColour = part.taperEnd.getBackgroundOpacityColour(colourIndex);
			svgString += `\n<!-- TAPER END: ${part.shape} -->\n`

			// now we get to draw the taper
			switch (part.shape) {
				case "hexagonal":
					// TODO - need to intersect between the two
					// svgString += rectangle(
					// 		startX - xOffsetTaperEnd * 5,
					// 		midY - part.endHeight / 2 * 5 + 0.25,
					// 		(part.length + xOffsetTaperEnd) * 5 - 0.5,
					// 		part.startHeight * 5 - 0.5,
					// 		"none",
					// 		backgroundColour);

					svgString += `<path d="M ${startX + (part.length + xOffsetTaperEnd) * 5} ${midY - part.endHeight / 2 * 5} ` +
						`C ${startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
						`${startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
						`${startX + (part.length + xOffsetTaperEnd) * 5} ${midY}" ` +
						`stroke-width="0.5" ` +
						`stroke="${strokeColor}" ` +
						`stroke-linecap="round" ` +
							`fill-opacity="${opaqueColour.opacity}" ` +
							`fill="${opaqueColour.colour}" />\n`;

					svgString += `<path d="M ${startX + (part.length + xOffsetTaperEnd) * 5} ${midY + part.endHeight / 2 * 5} ` +
						`C ${startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
						`${startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
						`${startX + (part.length + xOffsetTaperEnd) * 5} ${midY}" ` +
						`stroke-width="0.5" ` +
						`stroke="${strokeColor}" ` +
						`stroke-linecap="round" ` +
							`fill-opacity="${opaqueColour.opacity}" ` +
							`fill="${opaqueColour.colour}" />\n`;
				break;
				case "cylinder":
					svgString += rectangle(startX + part.length * 5 + xOffsetTaperEnd * 5, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperEnd * -5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
					svgString += `<path d="M ${startX + part.length * 5 + xOffsetTaperEnd * 5} ${midY - part.endHeight / 2 * 5} ` +
						`C ${startX + ((part.length) * 5 - (xOffsetTaperEndScale * xOffsetTaperEnd) * 5)} ${midY - part.endHeight/2 * 5}, ` +
						`${startX + ((part.length) * 5 - (xOffsetTaperEndScale * xOffsetTaperEnd) * 5)} ${midY + part.endHeight/2 * 5}, ` +
						`${startX + part.length * 5 + xOffsetTaperEnd * 5} ${midY + part.endHeight / 2 * 5}" ` +
						`stroke-width="0.5" ` +
						`stroke="${strokeColor}" ` +
						`stroke-linecap="round" ` +
							`fill-opacity="${opaqueColour.opacity}" ` +
							`fill="${opaqueColour.colour}" />\n`;
					break;
			}
		}
		return (svgString);
	}

	protected renderFrontDimensions(x: number, y: number): string {
		let svgString: string = "";
		// THIS IS THE FRONT VIEW

		let extrasHeight: number = 0;
		let extrasOffset: number = 0;
		let extrasOffsetHeight: number = 0;
		// do we have any extras?

		let thisExtraPart: Extra = null;
		for(const component of this.pencil.components) {
			if(component.extras.length > 0){

				for(const extra of component.extras){
					if(extra.depth > extrasHeight){
						extrasHeight = extra.height;
						extrasOffset = extra.yOffset;
						extrasOffsetHeight = component.maxHeight/2;
						thisExtraPart = extra;
					}
				}
			}
		}

		// we will be drawing the left dimension for the full body height - we need to take
		// into account whether there is an extra part
		if(thisExtraPart) {
			// draw the dimensions for the top part of the extra
			svgString += dimensionsHorizontal(x - thisExtraPart.depth/2 * 5,
				y - 60,
				thisExtraPart.depth * 5,
				`${formatToTwoPlaces(thisExtraPart.depth)} mm`,
				TextOrientation.TOP,
				true);

			svgString += dimensionsVertical(x + 62,
				y - extrasOffset * 5 - extrasHeight * 5,
				extrasHeight * 5,
				`${(Math.round((thisExtraPart.height) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.RIGHT);

			// draw the dimensions for the pencil
			svgString += dimensionsVertical(x + 50,
				y - this.pencil.maxHeight/2 * 5,
				this.pencil.maxHeight * 5,
				`${formatToTwoPlaces(this.pencil.maxHeight)} mm`,
				TextOrientation.RIGHT);


			const pencilExtraHeight: number  = this.pencil.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset);
			// we have an extra part - the height is more than the simple body height
			svgString += dimensionsVertical(x - 50,
				y - extrasOffset * 5 - extrasHeight * 5,
				pencilExtraHeight * 5,
				`${pencilExtraHeight} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		} else {
			// no extra height here - so we can just draw the text
			svgString += dimensionsVertical(x - 50,
				y - this.pencil.maxHeight/2*5,
				this.pencil.maxHeight * 5,
				`${formatToTwoPlaces(this.pencil.maxHeight)} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		}

		// This is the BOTTOM WIDTH of the pencil
		svgString += dimensionsHorizontal(x - this.pencil.maxWidth/2 * 5,
			y + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.maxWidth * 5,
			`${formatToTwoPlaces(this.pencil.maxWidth)} mm`,
			TextOrientation.BOTTOM,
			true);

		return(svgString);
	}

	protected renderFrontComponents(x: number, y: number, colourIndex:number): string {
		let svgString: string = "";

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white%0");

		// we want to render them back to front so that the last component is on
		// the bottom

		this.pencil.components.reverse()

		// go through the components and render them
		for(const component of this.pencil.components) {

			svgString += `\n<!-- FRONT COMPONENT: ${component.type} -->\n`
			component.parts.reverse();
			for (let part of component.parts) {
				colour = part.getOpacityColour(colourIndex);
				switch (part.shape) {
					case "cylinder":
						svgString += circle(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
						break;
					case "cone":
					case "convex":
					case "concave":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, x, y, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, x, y, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(x, y, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(x, y, part.startHeight, colour);
						break;
				}
			}

			for(const extra of component.extras) {
				extra.extraParts.reverse();
				svgString += renderExtra(x, y, extra.xOffset, extra.yOffset, extra.depth, extra.extraParts, extra.getBackgroundOpacityColour(colourIndex));
				extra.extraParts.reverse();
			}

			component.parts.reverse();
		}

		// now put it back in order
		this.pencil.components.reverse()

		for(let front of this.pencil.front) {
			// only care about the first dimension - which is the width
			let frontFillColour: OpaqueColour = front.getOpacityColour(colourIndex);

			// render the front piece
			switch (front.shape) {
				case "cylinder":
					svgString += circle(x, y, front.width/2 * 5, "0.5", "dimgray", frontFillColour);
					break;
			}
		}

		return(svgString);
	}

	protected renderSideDimensions(x: number, y: number): string {
		let svgString: string = "";

		// let x: number = (this._width - this.pencil.totalLength * 5)/2;
		// let y: number = this._height/2;

		// render the component dimensions
		for (let component of this.pencil.components) {
			if(component.isHidden) {
				continue;
			}
			// draw all the dimensions
			svgString += dimensionsHorizontal(x,
				y - 120,
				component.length * 5,
				`${formatToTwoPlaces(component.length)} mm${(component.length * 5 > 30 ? "\n" : " ")}${component.type}`,
				TextOrientation.TOP_ROTATED,
				true);

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extra of component.extras) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(x + extra.xOffset * 5,
					y - 80,
					extra.length * 5,
					`${formatToTwoPlaces(extra.length)} mm\n${component.type} (extra)`,
					TextOrientation.CENTER,
					true);
			}

			x += component.length * 5;
		}

		return(svgString);
	}

	protected renderBackDimensions(x: number, y: number): string {
		let svgString: string = "";

		for (let component of this.pencil.components) {
			switch (component.type) {
				case "body":
					svgString += dimensionsVertical(x,
						y - component.maxHeight/2 * 5,
						component.maxHeight * 5,
						`${component.maxHeight} mm`,
						TextOrientation.LEFT_ROTATED,
						true);

					svgString += dimensionsVertical(x,
						y - component.maxHeight/2 * 5,
						component.maxHeight * 5,
						"body",
						TextOrientation.BOTTOM_ROTATED,
						true);
					break;
				case "grip":
					svgString += dimensionsVertical(x - 40,
						y - component.maxHeight/2 * 5,
						component.maxHeight * 5,
						`${component.maxHeight} mm`,
						TextOrientation.LEFT_ROTATED,
						true);

					svgString += dimensionsVertical(x - 40,
						y - component.maxHeight/2 * 5,
						component.maxHeight * 5,
						"grip",
						TextOrientation.BOTTOM_ROTATED,
						true);
					break;
			}
		}
		return(svgString);
	}

	protected renderBackComponents(x: number, y: number, colourIndex:number): string {
		let svgString: string = "";

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");
		// go through the components and render them
		for(const component of this.pencil.components) {
			colour = component.getOpacityColour(colourIndex);

			for (let part of component.parts) {
				switch (part.shape) {
					case "cylinder":
						svgString += circle(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, x, y, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, x, y, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(x, y, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(x, y, part.startHeight, colour);
						break;
				}
			}

			for(const extra of component.extras) {
				svgString += renderExtra(x, y, extra.xOffset, extra.yOffset, extra.depth, extra.extraParts, extra.getBackgroundOpacityColour(colourIndex));
			}

		}

		for(let back of this.pencil.back) {
			let backFillColour: OpaqueColour = back.getOpacityColour(colourIndex);

			// render the back piece
			switch (back.shape) {
				case "cylinder":
					svgString += circle(x, y, back.width/2 * 5, "1", "dimgray", backFillColour);
					break;
			}
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
					xOffset + extra.xOffset * 5,
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

	/**
	 * Render all side components
	 *
	 * @param x The x co-ordinate to start rendering the components
	 * @param y The y co-ordinate to start rendering the components
	 * @param colourIndex The colour index of the Pencil
	 *
	 * @protected
	 */
	protected renderSideComponents(x: number, y: number, colourIndex:number): string {
		let svgString: string = "";
		let xStart: number = x;

		for (let component of this.pencil.components) {
			svgString += this.renderSideComponent(x, y, component, colourIndex);
			x += component.length * 5;
		}

		// now for the tapering...
		for (let component of this.pencil.components) {
			let colourOpacity:OpaqueColour = component.getOpacityColour(colourIndex);

			for(let part of component.parts) {
				svgString += this.renderTaper(xStart, y, part, colourIndex);

				xStart += part.length * 5;
			}
		}

		return(svgString);
	}

	protected renderSideComponent(x: number, y: number, component: Component, colourIndex:number): string {
		let svgString: string = `\n\n<!-- renderSideComponent: ${component.type} -->\n`;
		let xStart: number = x;

		for(const extra of component.extras) {
			let backgroundColour: string = "black";
			if(component.getOpacityColour(colourIndex).colour === "black") {
				backgroundColour = "dimgray";
			}

			svgString += drawExtraBackground(x + extra.xOffset * 5, y - extra.yOffset * 5, extra.extraParts, backgroundColour);
			break;
		}

		for(let part of component.parts) {
			svgString += this.renderPart(x, y, part, colourIndex);
			// finally the shape
			let taperStartOffset: number = (part.taperStart?.xOffset ? part.taperStart.xOffset : 0);
			let taperEndOffset: number = (part.taperEnd?.xOffset ? part.taperEnd.xOffset : 0);
			switch (part.shape) {

				case "hexagonal":
					// svgString += drawShapeDetails(startX, midY, (part.length) * 5);
					// startX - xOffsetTaperEnd * 5
					svgString += drawShapeDetails(x + (part.internalOffset + taperStartOffset) * 5, y, (part.length + taperEndOffset) * 5);
					break;
				case "octagonal":
					// svgString += drawShapeDetails(startX, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
					// svgString += drawShapeDetails(startX, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
					svgString += drawShapeDetails(x + part.internalOffset * 5, y - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
					svgString += drawShapeDetails(x + part.internalOffset * 5, y + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
					break;
			}
			x += part.length * 5;
		}


		for(const extra of component.extras) {
			let colour: OpaqueColour = extra.getOpacityColour(colourIndex)
			svgString += drawExtraForeground(xStart + extra.xOffset * 5, y - extra.yOffset * 5, extra.extraParts, colour.colour);
			break;
		}

		return(svgString);
	}




	protected renderHiddenSideComponents(x: number, y: number, colourIndex:number): string {
		let svgString: string = "";

		let colourOpacity: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");

		for (let component of this.pencil.components) {
			if(component.isHidden) {
				colourOpacity = component.getOpacityColour(colourIndex);

				for(const part of component.internalStart) {
					svgString += this.renderPart(x, y, part, colourIndex);
					x += part.length * 5;
				}
				for(const part of component.internalEnd) {
					svgString += this.renderPart(x, y, part, colourIndex);
					x += part.length * 5;
				}
			}
		}


		// reset to draw the taper lines last
		x = this._width/2 - (this.pencil.totalLength*5/2);

		for (let component of this.pencil.components) {
			for(let part of component.parts) {
				svgString += this.renderTaper(x, y, part, colourIndex);
				x += part.length * 5;
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

	protected renderComponent(startX:number, midY:number, component:Component, colourIndex: number): string {
		let svgString: string = "";
		for(const part of component.parts) {
			svgString += this.renderPart(startX, midY, part, colourIndex);

			// now we need to draw the part shap
		}
		return(svgString);
	}

	/**
	 * Render a specific part, <strong>WITHOUT</strong> any extras that are
	 * attached to it, the order of rendering for a part is as follows:
	 *
	 *  - The background colour for the shape of the part
	 *  - The outline of the part - if this part is joined then the left line is
	 *    not drawn, if the next part is joined, then the right hand line is no
	 *    joined
	 *  - The details of the shape (i.e. whether it is hexagonal, octagonal etc.)
	 *  - The finish for the part - in order of the comma separated list of
	 *    finishes
	 *
	 * @param x The x co-ordinate at which to start the drawing of the part
	 * @param y The y co-ordinate at which to start the drawing of trhe part
	 * @param part The part to render
	 * @param colourIndex The colour Index for the pencil colour
	 * @param nextPartJoined Whether the next part is joined to this part
	 *
	 * @protected
	 */
	protected renderPart(x: number, y:number, part: Part, colourIndex: number, nextPartJoined: boolean=false):string {
		let svgString: string = `\n\n<!-- renderPart: ${part.shape} -->\n`;

		// get the stroke colour
		let strokeColour:string = "black"
		if(part.getOpacityColour(colourIndex).colour === "black") {
			strokeColour = "dimgray";
		}

		// maybe we have an over-ride colour and material
		let opaqueColour: OpaqueColour = part.getOpacityColour(colourIndex);

		// draw the background colour first
		switch (part.shape) {
			case "cylinder":
			case "hexagonal":
			case "octagonal":
			case "cone":
				svgString += `<path d="M${x + part.internalOffset * 5} ` +
						`${y - (part.startHeight / 2 * 5)} ` +
						`L${x + part.internalOffset * 5 + part.length * 5} ${y - (part.endHeight / 2 * 5)} ` +
						`L${x + part.internalOffset * 5 + part.length * 5} ${y + (part.endHeight / 2 * 5)} ` +
						`L${x + part.internalOffset * 5} ${y + (part.startHeight / 2 * 5)} Z" ` +
					`stroke-width="0.5" ` +
					`stroke="${strokeColour}" ` +
					`stroke-linejoin="round" ` +
					`fill="${opaqueColour.colour}" ` +
					`fill-opacity="${opaqueColour.opacity}"/>\n`

				// TODO - move to later....
				if(part.joined) {
					svgString += lineJoined(x,
						y - (part.endHeight / 2 * 5) + 0.25,
						part.startHeight * 5 - 0.5, "3", opaqueColour);
					// svgString += lineJoined(startX + part.internalOffset * 5,
					// 	midY - (part.endHeight / 2 * 5) + 0.25,
					// 	part.startHeight * 5 - 0.5, "3", opaqueColour.colour);
				}

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

				svgString += `<path d="M${x + part.internalOffset * 5} ${y - (part.startHeight / 2 * 5)} ` +
					`Q${x + part.internalOffset * 5 + offsetX} ${y - offsetY} ` +
					`${x + part.internalOffset * 5} ${y + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" ` +
					`stroke="${strokeColour}" ` +
					`stroke-linejoin="round" ` +
					`fill="${opaqueColour.colour}" ` +
					`fill-opacity="${opaqueColour.opacity}"/>\n`
				break;
			case "concave":
				svgString += `<path d="M${x + part.internalOffset * 5} ${y - (part.startHeight / 2 * 5)} ` +
					`Q${x + part.internalOffset * 5 + part.length * 5} ${y} ` +
					`${x + part.internalOffset * 5} ${y + (part.startHeight / 2 * 5)}" ` +
					`stroke-width="0.5" ` +
					`stroke="${strokeColour}" ` +
					`stroke-linejoin="round" ` +
					`fill="${opaqueColour.colour}" ` +
					`fill-opacity="${opaqueColour.opacity}"/>\n`
				break;
		}

		// now for the finish - although this only really works for cylinder types
		// the question becomes whether there will be other finishes on different
		// objects
		for(const finish of part.finish.split(",")) {
			let xStart: number = x + (part.internalOffset)* 5;
			let xEnd: number = x + part.length * 5;

			let yStartTop: number = y - (part.startHeight / 2 * 5);
			let yStartBottom: number = y + (part.startHeight / 2 * 5);

			let yEndTop: number = y - (part.endHeight / 2 * 5);
			let yEndBottom: number = y + (part.endHeight / 2 * 5);

			// TODO - do specific lookup for the pattern
			if(this.patternMap.has(finish)) {
				svgString += `<path d="M${xStart} ${yStartTop} ` +
					`L${xEnd} ${yEndTop} ` +
					`L${xEnd} ${yEndBottom} ` +
					`L${xStart} ${yStartBottom} Z" stroke-width="1.0" stroke="black" fill="url(#${finish})"/>\n`;
			} else if(SVGRenderer.inBuiltPatternMap.has(finish)) {
				svgString += `<path d="M${xStart} ${yStartTop} ` +
					`L${xEnd} ${yEndTop} ` +
					`L${xEnd} ${yEndBottom} ` +
					`L${xStart} ${yStartBottom} Z" stroke-width="1.0" stroke="black" fill="url(#${finish})"/>\n`;
			}

			switch (finish) {
				case "ferrule":
					let offset = ((part.length / 13) * 5) / 2;

					for (let i = 0; i < 13; i++) {
						if (i !== 0 && i !== 6 && i < 12) {
							svgString += `<line x1="${x + part.internalOffset * 5 + offset}" ` +
								`y1="${y + 1.0 - part.startHeight / 2 * 5}" ` +
								`x2="${x + part.internalOffset * 5 + offset}" ` +
								`y2="${y - 1.0 + part.startHeight / 2 * 5}" ` +
								`stroke-width="1" stroke="gray" />\n`
						}
						offset += (part.length / 13) * 5;
					}

					svgString += drawOutlineCircle(4, x + part.internalOffset * 5 + 15, y - part.startHeight / 4 * 5, new OpaqueColour(null, "dimgray"));

					break;
				case "spring":

					svgString += `<rect x="${x + part.internalOffset * 5 + 5}" ` +
						`y="${y - (part.endHeight / 2 * 5) - 5}" ` +
						`width="${part.length * 5 - 10}" ` +
						`height="${part.startHeight * 5 + 10}" ` +
						`stroke-width="0.0" stroke="black" fill="url(#spring)"/>\n`
					for (let i:number = 0; i < 4; i++) {
						svgString += `<line x1="${x + part.internalOffset * 5 + i * 2 + 0.5}" y1="${y - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${x + part.internalOffset * 5 + i * 2 + 0.5}" y2="${y + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${x + part.internalOffset * 5 + i * 2 + 0.5}" y1="${y - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${x + part.internalOffset * 5 + i * 2 + 0.5}" y2="${y + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;

						svgString += `<line x1="${x + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y1="${y - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${x + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y2="${y + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${x + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y1="${y - (part.endHeight / 2 * 5) - 5}" ` +
							`x2="${x + part.internalOffset * 5 + part.length * 5 - i * 2 -0.5}" y2="${y + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;

					}
					break;

				case "threaded":
					for (let i:number = 0; i < part.length; i++) {
						if((i + 1) > part.length) {
							// TODO - half a line
							break;
						}
						svgString += `<line x1="${x + part.internalOffset * 5 + i*5}" y1="${y - (part.endHeight / 2 * 5) - 2}" ` +
							`x2="${x + part.internalOffset * 5 + (i + 1) * 5}" y2="${y + (part.endHeight / 2 * 5) + 2}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
						svgString += `<line x1="${x + part.internalOffset * 5 + i*5}" y1="${y - (part.endHeight / 2 * 5) - 2}" ` +
							`x2="${x + part.internalOffset * 5 + (i + 1) * 5}" y2="${y + (part.endHeight / 2 * 5) + 2}" stroke="${opaqueColour}" stroke-linecap="round" stroke-width="1" />\n`;
					}
					break;
				case "indicator":
					// let backgoundColour: OpaqueColour = defaultOpaqueColour;
					let backgoundColour: OpaqueColour = part.getBackgroundOpacityColour(colourIndex);

					// now draw the indicator
					svgString += `<rect x="${x + part.internalOffset * 5 + 10}" ` +
						`y="${y - (part.endHeight / 4 * 5)}" ` +
						`width="${part.length * 5 - 20}" ` +
						`height="${part.startHeight / 2 * 5}" ` +
						`rx="3" ry="3" stroke-width="1" stroke="black" fill="${backgoundColour.colour}"/>\n`;
					svgString += `<text x="${x + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
						`y="${y}" ` +
						`text-anchor="middle" dominant-baseline="central">` +
						`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
						`HB` +
						`</tspan>` +
						`</text>`;
					break;
				case "indicator-split":
					// now draw the indicator

					// TODO - this should be at the top of the method
					let backgroundColour: OpaqueColour = part.getBackgroundOpacityColour(colourIndex);

					// horizontal
					svgString += `<rect x="${x + part.internalOffset * 5}" ` +
						`y="${y - 4}" ` +
						`width="${part.length * 5}" ` +
						`height="${8}" ` +
						`rx="0" ry="0" stroke-width="1" stroke="black" fill="${backgroundColour.colour}"/>\n`;
					svgString += `<rect x="${x + part.internalOffset * 5 + 6}" ` +
						`y="${y - (part.endHeight / 4 * 5)}" ` +
						`width="${part.length * 5 - 12}" ` +
						`height="${part.startHeight / 2 * 5}" ` +
						`rx="3" ry="3" stroke-width="1" stroke="black" fill="${backgroundColour.colour}"/>\n`;
					svgString += `<rect x="${x + part.internalOffset * 5 + 0.25}" ` +
						`y="${y - 3.75}" ` +
						`width="${part.length * 5 - 0.5}" ` +
						`height="${7.5}" ` +
						`rx="0" ry="0" stroke-width="1" stroke="none" fill="${backgroundColour.colour}"/>\n`;
					svgString += `<text x="${x + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
						`y="${y}" ` +
						`text-anchor="middle" dominant-baseline="central">` +
						`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 14}" > ` +
						`HB` +
						`</tspan>` +
						`</text>`;
					break;
				case "indicator-etched":
					svgString += `<text x="${x + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
						`y="${y}" ` +
						`text-anchor="middle" dominant-baseline="central">` +
						`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 12}" > ` +
						`HB` +
						`</tspan>` +
						`</text>`;
					break;
			}
		}

		return(svgString);
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
				svgString += lineVerticalGuide(offset + extra.xOffset * 5,
						this._height/2 - 80,
						80);
				svgString += lineVerticalGuide(offset + extra.xOffset * 5 + extra.length * 5,
						this._height/2 - 80,
						80);
			}
		}

		svgString += lineVerticalGuide(offset, this._height/2 - 88 - this.pencil.maxHeight/2 * 5, 140 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}

}