// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import { Component } from "./component/Component.mjs";
import {
	drawTextBoldCentred,
	drawTextBold,
	drawText,
	drawVerticalLine
} from "../utils/svg-helper.mjs";


export class Pencil {
	static WIDTH = 1500;
	static HEIGHT = 600;
	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
			`width="${Pencil.WIDTH}" ` +
			`height="${Pencil.HEIGHT}">\n` +
			`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
			`<rect width="6" height="6" fill='none'/>\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
			`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
			`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
			`</pattern>\n` +
			`<rect x="0" y="0" width="${Pencil.WIDTH}" height="${Pencil.HEIGHT}" fill="white" stroke="black" stroke-width="4" />\n` +
			`<rect x="2" y="2" width="${Pencil.WIDTH - 4}" height="${Pencil.HEIGHT - 4}" fill="white" stroke="orange" stroke-width="1" />\n`
			;

	static SVG_END = `<text x="50%" y="${Pencil.HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
			`</svg>\n`;

	name = "";
	brand = "";
	leadSize = "";
	filePath = "";
	components = [];
	// width = 0;
	text = "";

	maxWidth = 0;
	maxHeight = 0;
	totalLength = 0

	materials = [];
	materialsSet = new Set();
	colourComponent = ""
	colourComponents = [ "white" ];
	weight = 0.0;
	modelNumber = null;
	front = [];
	back = [];
	colourMap = {};

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateDetails()
	}

	#generateDetails() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

		this.colourComponent = json.colour_component ?? this.colourComponent;
		this.colourMap = json.colour_map ?? this.colourMap;
		this.modelNumber = json.model_number ?? this.modelNumber;


		this.front = json.front ?? this.front;
		this.back = json.back ?? this.back;

		for(const component of json.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.totalLength += thisComponent.getWidth()

			if(thisComponent.type === this.colourComponent) {
				this.colourComponents = thisComponent.colours;
			}

			let tempWidth = thisComponent.getMaxWidth();
			if(tempWidth >= this.maxWidth) {
				this.maxWidth = tempWidth;
			}
			let tempHeight = thisComponent.getMaxHeight();
			if(tempHeight >= this.maxHeight) {
				this.maxHeight = tempHeight;
			}

			const componentMaterial = component.material;

			if(!this.materialsSet.has(componentMaterial)) {
				this.materials.push(componentMaterial);
				this.materialsSet.add(componentMaterial);
			}
		}

		this.brand = json.brand ?? this.brand;
		this.model = json.model ?? this.model;

		this.leadSize = json.lead_size ?? this.leadSize;
		this.text = json.text ?? this.text;


		// console.log(json);
	}

	renderSvg(shouldColour, colourIndex, colourComponent) {

		let thisColourIndex = colourIndex ?? 0;
		let thisColourComponent = colourComponent ?? "";

		let svgString = Pencil.SVG_START;
		let xPosition = (Pencil.WIDTH - this.totalLength)/2;

		svgString += drawTextBold(`${this.brand} // ${this.model} ${(this.modelNumber ? "(Model #: " + this.modelNumber + ")" : "")}`, 30, 50, "2.0em");
		svgString += drawText(`${this.text}`, 30, 80, "1.1em");

		svgString += this.drawSvgGuidelines();

		svgString += this.drawFrontDimensions();

		// now we are going to go through each of the components and draw the shapes
		let offset = Pencil.WIDTH/2 - this.getTotalLength()/2;

		// is the extra the first component, or the last
		for (let component of this.components) {
			// vertical line

			svgString += drawVerticalLine(offset, Pencil.HEIGHT/2 - 99 - this.maxHeight/2 * 5, 22, "black");

			let currentOffset = offset;

			offset += component.getWidth();
			if(component.getWidth()/5 > 8) {
				svgString += `<text x="${(offset + currentOffset) / 2 - 3}" ` +
						`y="${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
						`transform="rotate(-90, ${(offset + currentOffset) / 2 - 3}, ${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
						`font-size="1.2em" font-weight="bold" dominant-baseline="auto">` +
						`${(Math.round(component.getWidth() / 5 * 100) / 100).toFixed(2)} mm` +
						`</text>\n`
				svgString += `<text x="${(offset + currentOffset) / 2 + 3}" ` +
						`y="${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
						`transform="rotate(-90, ${(offset + currentOffset) / 2 + 3}, ${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
						`font-size="1.2em" font-weight="bold" dominant-baseline="hanging">` +
						`${component.getType()}` +
						`</text>\n`
			} else {
				svgString += `<text x="${(offset + currentOffset) / 2}" ` +
						`y="${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
						`transform="rotate(-90, ${(offset + currentOffset) / 2}, ${Pencil.HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
						`font-size="1.2em" font-weight="bold" dominant-baseline="middle">` +
						`${(Math.round(component.getWidth() / 5 * 100) / 100).toFixed(2)} mm ${component.getType()}` +
						`</text>\n`
			}

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance

				// draw the start vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 - 24 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the start vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 + 120}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 + 96}" ` +
						`stroke="black" stroke-width="1" />\n`;

				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 + 96}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 + 120}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the vertical line
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 - 24 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;


				// draw the horizontal line
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 - 35 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 - 35 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the end vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 + 132 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 + 132 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${Pencil.HEIGHT/2 + 70 + this.maxHeight/2 * 5}" font-size="1.2em" text-anchor="middle" dominant-baseline="central">${component.getMaterial()}</text>\n`
				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${(Math.round(extraPart.extraWidth * 100) / 100).toFixed(2)} mm</text>\n`
				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${Pencil.HEIGHT/2 - 26 - this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${component.getType()} (extra)</text>\n`
			}
		}

		svgString += `<line ` +
				`x1="${offset}" ` +
				`y1="${Pencil.HEIGHT/2 - 77 - this.maxHeight/2 * 5}" ` +
				`x2="${offset}" ` +
				`y2="${Pencil.HEIGHT/2 - 99 - this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		// horizontal line
		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" ` +
				`y1="${Pencil.HEIGHT/2 - 88 - this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" ` +
				`y2="${Pencil.HEIGHT/2 - 88 - this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;




		// THIS IS FOR THE SIDE VIEW
		// now for the total
		// horizontal
		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// left
		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 - this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// right
		svgString += `<line x1="${Pencil.WIDTH/2 + this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		svgString += drawTextBoldCentred(`${(Math.round(this.totalLength/5 * 100) / 100).toFixed(2)} mm`, Pencil.WIDTH/2, Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5, "1.2em");
		svgString += drawTextBoldCentred("Side view", Pencil.WIDTH/2, Pencil.HEIGHT - 60, "1.8em");
		svgString += drawTextBoldCentred("Back", Pencil.WIDTH-100, Pencil.HEIGHT - 60, "1.8em");




		offset = Pencil.WIDTH/2 - this.getTotalLength()/2;
		for (let component of this.components) {
			svgString += `<line x1="${offset}" ` +
					`y1="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
					`x2="${offset}" ` +
					`y2="${Pencil.HEIGHT/2 + 124 + this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
			let currentOffset = offset;

			offset += component.getWidth();
			svgString += `<text x="${(offset + currentOffset)/2}" y="${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5}" transform="rotate(-90, ${(offset + currentOffset)/2}, ${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5})" font-size="1.2em" text-anchor="end" dominant-baseline="middle">${component.getMaterial()}</text>\n`
		}

		svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
				`x2="${offset}" y2="${Pencil.HEIGHT/2 + 124 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		for (let component of this.components) {
			svgString += component.renderBack(shouldColour, Pencil.WIDTH - 100, this.colourMap, thisColourIndex, thisColourComponent);
		}

		// last thing we do is to draw the back section in order
		for(let back of this.back) {
			let dimensionsTemp = back.dimensions.split("x");
			let dimensions = [];
			for(const dimension of dimensionsTemp) {
				dimensions.push(dimension);
			}

			switch (back.type) {
				case "circle":
					svgString += `<circle cx="${Pencil.WIDTH - 100}" cy="${Pencil.HEIGHT / 2}" r="${dimensions[0]/2 * 5}" stroke="dimgray" stroke-width="0.5" fill="${back.fill}" />`
					break;
			}
		}

		this.components.reverse();
		for (let component of this.components) {
			svgString += component.renderFront(shouldColour, 160, this.colourMap, thisColourIndex, thisColourComponent);
		}

		for(let front of this.front) {
			let dimensionsTemp = front.dimensions.split("x");
			let dimensions = [];
			for(const dimension of dimensionsTemp) {
				dimensions.push(dimension);
			}

			switch (front.type) {
				case "circle":
					svgString += `<circle cx="160" cy="${Pencil.HEIGHT / 2}" r="${dimensions[0]/2 * 5}" stroke="dimgray" stroke-width="0.5" fill="${front.fill}" />`
					break;
			}
		}
		this.components.reverse();

		// now go through each component and render the parts
		for (let component of this.components) {
			svgString += component.renderSvg(shouldColour, xPosition, this.colourMap, thisColourIndex);
			xPosition += component.getWidth();
		}

		svgString += this.drawSvgColours();

		svgString += this.drawSvgMaterials();

		svgString += Pencil.SVG_END;

		// now draw the colours

		return(svgString);
	}


	/**
	 * Draw the guidelines for the total drawing - this should be done close to
	 * first as you want them in the background.
	 *
	 * @returns {string} The SVG representation of the guidelines
	 */
	drawSvgGuidelines() {
		// now we are going to go through each of the components and draw the shapes
		let offset = Pencil.WIDTH/2 - this.getTotalLength()/2;
		let svgString = "";

		let hasExtra = false;
		// now for the extra components guidelines
		for (let component of this.components) {
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance
				svgString += `<line x1="100" ` +
						`y1="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
						`x2="${Pencil.WIDTH - 100}" ` +
						`y2="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				svgString += `<line x1="160" ` +
						`y1="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5}" ` +
						`x2="${Pencil.WIDTH - 100}" ` +
						`y2="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;

				// guidelines for the extra width
				svgString += `<line x1="${160 - extraPart.extraDepth/2 * 5}" ` +
						`y1="${Pencil.HEIGHT/2 - 70}" ` +
						`x2="${160 - extraPart.extraDepth/2 * 5}" ` +
						`y2="${Pencil.HEIGHT/2}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;

				svgString += `<line x1="${160 + extraPart.extraDepth/2 * 5}" ` +
						`y1="${Pencil.HEIGHT/2 - 70}" ` +
						`x2="${160 + extraPart.extraDepth/2 * 5}" ` +
						`y2="${Pencil.HEIGHT/2}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				hasExtra = true;
			}
		}

		// FRONT VIEW GUIDELINES

		// top line
		svgString += `<line x1="${hasExtra ? (Pencil.WIDTH - 100) : 100}" ` +
				`y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH - 100}" ` +
				`y2="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;
		// bottom line of full pencil
		svgString += `<line x1="100" y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH - 100}" y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;

		// Vertical line of width
		svgString += `<line x1="${160 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${160 - this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;
		svgString += `<line x1="${160 + this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${160 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;

		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = Pencil.WIDTH/2 - this.getTotalLength()/2;

		for (let component of this.components) {
			// vertical line
			svgString += `<line x1="${offset}" ` +
					`y1="${Pencil.HEIGHT/2 - 88 - this.maxHeight/2 * 5}" ` +
					`x2="${offset}" ` +
					`y2="${Pencil.HEIGHT/2 + 120 + this.maxHeight/2 * 5}" ` +
					`stroke="#cfcfcf" stroke-width="1" />\n`;

			offset += component.getWidth();

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 - 44 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 + 120}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y1="${Pencil.HEIGHT/2 - 44 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
						`y2="${Pencil.HEIGHT/2 + 120}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
			}
		}

		svgString += `<line x1="${offset}" ` +
				`y1="${Pencil.HEIGHT/2 - 88 - this.maxHeight/2 * 5}" ` +
				`x2="${offset}" ` +
				`y2="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;

		return(svgString);
	}

	drawFrontDimensions() {
		let svgString = "";
		// THIS IS THE FRONT VIEW

		let extrasHeight = 0;
		let extrasOffset = 0;
		// do we have any extras?

		let thisExtraPart = null;
		for(const component of this.components) {
			if(component.extraParts.length > 0){

				for(const extraPart of component.extraParts){
					if(extraPart.extraHeight > extrasHeight){
						extrasHeight = extraPart.extraHeight;
						extrasOffset = extraPart.extraOffset[1];
						thisExtraPart = extraPart;
					}
				}
			}
		}

		// now for the measurements of the height
		// top horizontal
		if(thisExtraPart) {
			svgString += `<line x1="100" ` +
					`y1="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="120" ` +
					`y2="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="${160 - thisExtraPart.extraDepth/2 * 5}" ` +
					`y1="${Pencil.HEIGHT/2 - 70}" ` +
					`x2="${160 - thisExtraPart.extraDepth/2 * 5}" ` +
					`y2="${Pencil.HEIGHT/2 - 50}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="${160 + thisExtraPart.extraDepth/2 * 5}" ` +
					`y1="${Pencil.HEIGHT/2 - 70}" ` +
					`x2="${160 + thisExtraPart.extraDepth/2 * 5}" ` +
					`y2="${Pencil.HEIGHT/2 - 50}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="${160 - thisExtraPart.extraDepth/2 * 5}" ` +
					`y1="${Pencil.HEIGHT/2 - 60}" ` +
					`x2="${160 + thisExtraPart.extraDepth/2 * 5}" ` +
					`y2="${Pencil.HEIGHT/2 - 60}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<text x="160" ` +
					`y="${Pencil.HEIGHT/2 - 80}" ` +
					`font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">` +
					`${(Math.round((thisExtraPart.extraDepth) * 100) / 100).toFixed(2)} mm` +
					`</text>\n`

		} else {
			svgString += `<line x1="100" ` +
					`y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
					`x2="120" ` +
					`y2="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

		}
		// bottom horizontal
		svgString += `<line x1="100" ` +
				`y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`x2="120" ` +
				`y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		// down stroke
		if(thisExtraPart) {
			svgString += `<line x1="110" ` +
					`y1="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="110" ` +
					`y2="${Pencil.HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
		} else {
			svgString += `<line x1="110" ` +
					`y1="${Pencil.HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
					`x2="110" ` +
					`y2="${Pencil.HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
		}

		if(thisExtraPart) {
			svgString += `<line x1="200" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="220" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="200" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`x2="220" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="210" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="210" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<text x="224" ` +
					`y="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight/2 * 5}" ` +
					`font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
					`${(Math.round((thisExtraPart.extraHeight) * 100) / 100).toFixed(2)} mm` +
					`</text>\n`

			svgString += `<line x1="200" ` +
					`y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
					`x2="220" ` +
					`y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="210" ` +
					`y1="${Pencil.HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
					`x2="210" ` +
					`y2="${Pencil.HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<text x="224" y="${Pencil.HEIGHT/2}" font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">${(Math.round((this.maxHeight) * 100) / 100).toFixed(2)} mm</text>\n`

		}

		svgString += `<text x="90" y="${Pencil.HEIGHT/2}" transform="rotate(-90, 90, ${Pencil.HEIGHT/2})" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${(Math.round((this.maxHeight + extrasHeight) * 100) / 100).toFixed(2)} mm</text>\n`

		svgString += drawTextBoldCentred("Front", 160, Pencil.HEIGHT - 60, "1.8em");

		// and the measurements of the width
		// horizontal
		svgString += `<line x1="${160 - this.maxWidth/2 * 5}" ` +
				`y1="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`x2="${160 + this.maxWidth/2 * 5}" ` +
				`y2="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// left
		svgString += `<line x1="${160 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${160 - this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// right
		svgString += `<line x1="${160 + this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${160 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		svgString += drawTextBoldCentred(`${(Math.round(this.maxWidth * 100) / 100).toFixed(2)} mm`, 160, Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5, "1.2em");

		return(svgString);
	}

	drawSvgColours() {
		let svgString = "";
		// lets draw the pencil colours

		let colourOffset = Pencil.WIDTH - 60;

		svgString += `<text ` +
				`x="${colourOffset + 40}" ` +
				`y="30" ` +
				`font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
				`'${this.colourComponent}' colour variants` +
				`</text>\n`

		for(let colourComponent of this.colourComponents) {
			let fillColour = colourComponent;

			if (this.colourMap[colourComponent]) {
				fillColour = this.colourMap[colourComponent];
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

	drawSvgMaterials() {
		let svgString = "";
		let i = 0;
		let offset = 106;
		svgString += `<text ` +
				`x="30" ` +
				`y="${offset}" ` +
				`font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
				`Materials:` +
				`</text>\n`

		offset += 20;

		for(const material of this.materials) {
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

	getTotalLength() { return(this.totalLength); }
}