// TODO - get rid of the filesystem - should pass in a JSON object
import * as fs from 'fs';
import {Component} from "./component/Component.mjs";
import { drawTextBoldCentred, drawTextBold } from "../utils/svg-helper.mjs";

export class Pencil {
	static WIDTH = 1400;
	static HEIGHT = 800;
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

	constructor(filePath) {
		this.filePath = filePath;
		this.#generateDetails()
	}

	#generateDetails() {
		const json = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

		this.colourComponent = json.colour_component ?? this.colourComponent;

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

		svgString += drawTextBold(`${this.brand} // ${this.model} (${this.leadSize}mm)`, 30, 50, "2.0em");
		svgString += drawTextBold(`${this.text}`, 30, 74, "1.1em");

		svgString += this.drawSvgGuidelines();

		svgString += this.drawFrontDimensions();

		// now we are going to go through each of the components and draw the shapes
		let offset = Pencil.WIDTH/2 - this.getTotalLength()/2;

		for (let component of this.components) {
			// vertical line

			svgString += `<line x1="${offset}" ` +
					`y1="${Pencil.HEIGHT/2 - 77 - this.maxHeight/2 * 5}" ` +
					`x2="${offset}" ` +
					`y2="${Pencil.HEIGHT/2 - 99 - this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			let currentOffset = offset;

			offset += component.getWidth();
			svgString += `<text x="${(offset + currentOffset)/2}" ` +
					`y="${Pencil.HEIGHT/2 - 102 - this.maxHeight/2 * 5}" ` +
					`transform="rotate(-90, ${(offset + currentOffset)/2}, ${Pencil.HEIGHT/2 - 102 - this.maxHeight/2 * 5})" ` +
					`font-size="1.2em" font-weight="bold" dominant-baseline="middle">` +
					`${component.getType()} (${(Math.round(component.getWidth()/5 * 100) / 100).toFixed(2)} mm)` +
					`</text>\n`

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance

				// draw the start vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y1="${Pencil.HEIGHT/2 - 24 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5}" ` +
						`y2="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the start vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y1="${Pencil.HEIGHT/2 + 120}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5}" ` +
						`y2="${Pencil.HEIGHT/2 + 96}" ` +
						`stroke="black" stroke-width="1" />\n`;

				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5}" ` +
						`y1="${Pencil.HEIGHT/2 + 96}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5}" ` +
						`y2="${Pencil.HEIGHT/2 + 120}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the vertical line
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5}" ` +
						`y1="${Pencil.HEIGHT/2 - 24 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5}" ` +
						`y2="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;


				// draw the horizontal line
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y1="${Pencil.HEIGHT/2 - 35 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5}" ` +
						`y2="${Pencil.HEIGHT/2 - 35 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				// draw the end vertical
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y1="${Pencil.HEIGHT/2 + 132 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5}" ` +
						`y2="${Pencil.HEIGHT/2 + 132 - this.maxHeight/2 * 5}" ` +
						`stroke="black" stroke-width="1" />\n`;

				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5)}" y="${Pencil.HEIGHT/2 + 70 + this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${component.getMaterial()}</text>\n`
				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5)}" y="${Pencil.HEIGHT/2 - 46 - this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${component.getType()} (extra)</text>\n`
				svgString += `<text x="${offset + extraPart.extraOffset[0]*5 + (extraPart.extraWidth/2*5)}" y="${Pencil.HEIGHT/2 - 26 - this.maxHeight/2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">(${(Math.round(extraPart.extraWidth * 100) / 100).toFixed(2)} mm)</text>\n`
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
			svgString += `<text x="${(offset + currentOffset)/2}" y="${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5}" transform="rotate(-90, ${(offset + currentOffset)/2}, ${Pencil.HEIGHT/2 + 126 + this.maxHeight/2 * 5})" font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${component.getMaterial()}</text>\n`
		}

		svgString += `<line x1="${offset}" y1="${Pencil.HEIGHT/2 + 100 + this.maxHeight/2 * 5}" ` +
				`x2="${offset}" y2="${Pencil.HEIGHT/2 + 124 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		svgString += `<line x1="${Pencil.WIDTH/2 - this.totalLength/2}" y1="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH/2 + this.totalLength/2}" y2="${Pencil.HEIGHT/2 + 112 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		for (let component of this.components) {
			svgString += component.renderBack(shouldColour, Pencil.WIDTH - 100, thisColourIndex, thisColourComponent);
		}

		this.components.reverse();
		for (let component of this.components) {
			svgString += component.renderFront(shouldColour, 100, thisColourIndex, thisColourComponent);
		}
		this.components.reverse();

		// now go through each component and render the parts
		for (let component of this.components) {
			svgString += component.renderSvg(shouldColour, xPosition, thisColourIndex, thisColourComponent);
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
				svgString += `<line x1="40" ` +
						`y1="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
						`x2="${Pencil.WIDTH - 100}" ` +
						`y2="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				svgString += `<line x1="100" ` +
						`y1="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5}" ` +
						`x2="${Pencil.WIDTH - 100}" ` +
						`y2="${Pencil.HEIGHT/2 - extraPart.extraOffset[1] * 5}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				hasExtra = true;
			}
		}

		// FRONT VIEW GUIDELINES

		// top line
		svgString += `<line x1="${hasExtra ? (Pencil.WIDTH - 100) : 40}" ` +
				`y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH - 100}" ` +
				`y2="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;
		svgString += `<line x1="40" y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`x2="${Pencil.WIDTH - 100}" y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;
		svgString += `<line x1="${100 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 - this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;
		svgString += `<line x1="${100 + this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2}" ` +
				`stroke="#cfcfcf" stroke-width="1" />\n`;

		// SIDE VIEW GUIDELINES
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
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y1="${Pencil.HEIGHT/2 - 44 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0] * 5}" ` +
						`y2="${Pencil.HEIGHT/2 + 120}" ` +
						`stroke="#cfcfcf" stroke-width="1" />\n`;
				svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5}" ` +
						`y1="${Pencil.HEIGHT/2 - 44 - this.maxHeight/2 * 5}" ` +
						`x2="${offset + extraPart.extraOffset[0]*5 + extraPart.extraWidth*5}" ` +
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
			svgString += `<line x1="40" ` +
					`y1="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="60" ` +
					`y2="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
		} else {
			svgString += `<line x1="40" ` +
					`y1="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
					`x2="60" ` +
					`y2="${Pencil.HEIGHT/2 - this.maxHeight/2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

		}
		// bottom horizontal
		svgString += `<line x1="40" ` +
				`y1="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`x2="60" ` +
				`y2="${Pencil.HEIGHT/2 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// down stroke
		if(thisExtraPart) {
			svgString += `<line x1="50" ` +
					`y1="${Pencil.HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="50" ` +
					`y2="${Pencil.HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
		} else {
			svgString += `<line x1="50" ` +
					`y1="${Pencil.HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
					`x2="50" ` +
					`y2="${Pencil.HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;
		}

		if(thisExtraPart) {
			svgString += `<line x1="140" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="160" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="140" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`x2="160" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<line x1="150" ` +
					`y1="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5}" ` +
					`x2="150" ` +
					`y2="${Pencil.HEIGHT/2 - extrasOffset * 5}" ` +
					`stroke="black" stroke-width="1" />\n`;

			svgString += `<text x="164" ` +
					`y="${Pencil.HEIGHT/2 - extrasOffset * 5 - extrasHeight/2 * 5}" ` +
					`font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
					`${(Math.round((thisExtraPart.extraHeight) * 100) / 100).toFixed(2)} mm` +
					`</text>\n`
		}

		svgString += `<text x="30" y="${Pencil.HEIGHT/2}" transform="rotate(-90, 30, ${Pencil.HEIGHT/2})" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${(Math.round((this.maxHeight + extrasHeight) * 100) / 100).toFixed(2)} mm</text>\n`

		svgString += drawTextBoldCentred("Front", 100, Pencil.HEIGHT - 60, "1.8em");

		// and the measurements of the width
		// horizontal
		svgString += `<line x1="${100 - this.maxWidth/2 * 5}" ` +
				`y1="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`x2="${100 + this.maxWidth/2 * 5}" ` +
				`y2="${Pencil.HEIGHT/2 + 30 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// left
		svgString += `<line x1="${100 - this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 - this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;
		// right
		svgString += `<line x1="${100 + this.maxWidth/2 * 5}" y1="${Pencil.HEIGHT/2 + 20 + this.maxHeight/2 * 5}" ` +
				`x2="${100 + this.maxWidth/2 * 5}" y2="${Pencil.HEIGHT/2 + 40 + this.maxHeight/2 * 5}" ` +
				`stroke="black" stroke-width="1" />\n`;

		svgString += drawTextBoldCentred(`${(Math.round(this.maxWidth * 100) / 100).toFixed(2)} mm`, 100, Pencil.HEIGHT/2 + 50 + this.maxHeight/2 * 5, "1.2em");

		return(svgString);
	}

	drawSvgColours() {
		let svgString = "";
		// lets draw the pencil colours

		let colourOffset = Pencil.WIDTH - 60;
		for(let colourComponent of this.colourComponents) {
			svgString += `<rect x="${colourOffset}" y="20" width="40" height="40" stroke="black" stroke-width="2" fill="${colourComponent}" />\n`;
			colourOffset -= 60;
		}

		svgString += `<text x="${colourOffset + 50 }" y="40" font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">Variants by ${this.colourComponent} colour:</text>\n`
		return(svgString);
	}

	drawSvgMaterials() {
		let svgString = "";
		let i = 0;
		let offset = 0;
		for(const material of this.materials) {
			if(i === 0) {
				svgString += `<text ` +
						`x="${Pencil.WIDTH - 20}" ` +
						`y="${80 + offset}" ` +
						`font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
						`Materials: ${this.materials[i]}` +
						`</text>\n`
			} else {
				svgString += `<text ` +
						`x="${Pencil.WIDTH - 20}" ` +
						`y="${80 + offset}" ` +
						`font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
						`${this.materials[i]}` +
						`</text>\n`
			}

			i++;

			offset += 20;
		}
		return(svgString);
	}
	getTotalLength() { return(this.totalLength); }
}