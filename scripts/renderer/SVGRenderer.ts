import {Pencil} from "../model/Pencil.ts";
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
	lineVerticalGuide, renderBackExtra,
	SVG_HEIGHT,
	SVG_WIDTH,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";

export class SVGRenderer {
	static SVG_WIDTH = 1500;
	static SVG_HEIGHT = 600;

	static SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
		`width="${SVG_WIDTH}" ` +
		`height="${SVG_HEIGHT}">\n` +
		`<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
		`<rect width="6" height="6" fill='none'/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
		`<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
		`<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
		`</pattern>\n` +
		`<rect x="0" y="0" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="white" stroke="black" stroke-width="4" />\n` +
		`<rect x="2" y="2" width="${SVG_WIDTH - 4}" height="${SVG_HEIGHT - 4}" fill="white" stroke="orange" stroke-width="1" />\n`
	;

	static SVG_END = `<text x="50%" y="${SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
		`</svg>\n`;

	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
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
		let svgString:string = SVGRenderer.SVG_START;

		// centre line
		svgString += this.renderCentreLines();

		// overview text
		svgString += this.renderOverviewText();

		// colours
		svgString += this.renderPencilColours();

		// materials used
		svgString += this.renderMaterialList();

		// first up the grey guidelines
		svgString += this.renderGuidelines();

		// render the section titles (front/side/back)
		svgString += this.renderSectionTitles();

		// now we get into the dimensions

		// render the front dimensions
		svgString += this.renderFrontDimensions();

		//render the side dimensions
		svgString += this.renderSideDimensions();

		//render the side materials
		svgString += this.renderSideMaterials();

		// render the back dimensions
		svgString += this.renderBackDimensions();

		// now it is time to render the details of the pencil

		svgString += this.renderSideComponents(colourIndex);
		svgString += this.renderFrontComponents(colourIndex);
		svgString += this.renderBackComponents(colourIndex);

		// end the end of the SVG
		svgString += SVGRenderer.SVG_END;
		return(svgString);
	}

	private renderCentreLines(): string {
		let svgString:string = "";

		// the horizontal centre line with targets
		svgString += lineHorizontal(10, SVG_HEIGHT/2, SVG_WIDTH - 20, "1", "#000000", "2");
		svgString += target(30, SVG_HEIGHT/2, 40, 10);
		svgString += target(SVG_WIDTH - 30, SVG_HEIGHT/2, 40, 10);

		// FRONT VIEW the left hand side targets and the dashed line
		svgString += lineVertical(160, 140, SVG_HEIGHT - 220, "1", "#000000", "2");
		svgString += target(160, 150, 40, 10);
		svgString += target(160, SVG_HEIGHT - 100, 40, 10);

		// SIDE VIEW
		svgString += lineVertical(SVG_WIDTH/2, 140, SVG_HEIGHT - 220, "1", "#000000", "2");
		svgString += target(SVG_WIDTH/2, 150, 40, 10);
		svgString += target(SVG_WIDTH/2, SVG_HEIGHT - 100, 40, 10);

		// LEFT VIEW the right hand side targets and the dashed line
		svgString += lineVertical(SVG_WIDTH-100, 140, SVG_HEIGHT - 220, "1", "#000000", "2");
		svgString += target(SVG_WIDTH-100, 150, 40, 10);
		svgString += target(SVG_WIDTH-100, SVG_HEIGHT - 100, 40, 10);

		return(svgString);
	}

	private renderOverviewText(): string {
		let svgString = "";
		svgString += drawTextBold(`${this.pencil.brand} // ${this.pencil.model} ${(this.pencil.modelNumber ? "(Model #: " + this.pencil.modelNumber + ")" : "")}`, 30, 50, "2.0em");
		svgString += drawText(`${this.pencil.text}`, 30, 80, "1.1em");

		return(svgString);
	}

	private renderPencilColours(): string {
		let svgString:string = "";
		// lets draw the pencil colours

		let colourOffset:number = SVG_WIDTH - 60;

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

	private renderMaterialList(): string {
		let svgString:string = "";

		let offset:number = 106;
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

	private renderGuidelines(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number = SVG_WIDTH/2 - this.pencil.getTotalLength()/2;

		let hasExtra = false;
		// now for the extra side components guidelines
		for (let component of this.pencil.components) {
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance top of the extra parts
				const y = SVG_HEIGHT/2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5;

				svgString += lineHorizontalGuide(100, y, SVG_WIDTH - 200);
				// draw the straight-through line for guidance bottom of the extra parts
				svgString += lineHorizontalGuide(160, SVG_HEIGHT/2 - extraPart.extraOffset[1] * 5, SVG_WIDTH - 260);
				// guidelines for the extra width - left side
				svgString += lineVerticalGuide(160 - extraPart.extraDepth/2 * 5, SVG_HEIGHT/2 - 70, 70);
				// guidelines for the extra width - right side
				svgString += lineVerticalGuide(160 + extraPart.extraDepth/2 * 5, SVG_HEIGHT/2 - 70, 70);

				hasExtra = true;
			}
		}

		// FRONT VIEW GUIDELINES

		// top horizontal line
		svgString += lineHorizontalGuide((hasExtra ? 160 : 100), SVG_HEIGHT/2 - this.pencil.maxHeight/2 * 5, SVG_WIDTH - 100 - (hasExtra ? 160 : 100));

		// bottom line of full pencil
		svgString += lineHorizontalGuide(100, SVG_HEIGHT/2 + this.pencil.maxHeight/2 * 5, SVG_WIDTH - 200);

		// Vertical line of width - left
		svgString += lineVerticalGuide(160 - this.pencil.maxWidth/2 * 5,
			SVG_HEIGHT/2,
			20 + this.pencil.maxHeight/2 * 5);
		// Vertical line of width - right
		svgString += lineVerticalGuide(160 + this.pencil.maxWidth/2 * 5,
			SVG_HEIGHT/2,
			20 + this.pencil.maxHeight/2 * 5);

		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = SVG_WIDTH/2 - this.pencil.getTotalLength()/2;


		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, SVG_HEIGHT/2 - 120, 240);

			offset += component.getWidth();

			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0),
					SVG_HEIGHT/2 - 80,
					160);
				svgString += lineVerticalGuide(offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0),
					SVG_HEIGHT/2 - 80,
					160);
			}
		}

		svgString += lineVerticalGuide(offset, SVG_HEIGHT/2 - 88 - this.pencil.maxHeight/2 * 5, 208);
		return(svgString);
	}

	private renderSectionTitles(): string {
		let svgString: string = "";
		// Front view heading
		svgString += drawTextBoldCentred("Front", 160, SVG_HEIGHT - 60, "1.8em");
		// Side View Heading
		svgString += drawTextBoldCentred("Side view", SVG_WIDTH/2, SVG_HEIGHT - 60, "1.8em");
		// Back View Heading
		svgString += drawTextBoldCentred("Back", SVG_WIDTH-100, SVG_HEIGHT - 60, "1.8em");
		return(svgString);
	}

	private renderFrontDimensions(): string {
		let svgString: string = "";
		// THIS IS THE FRONT VIEW

		let extrasHeight: number = 0;
		let extrasOffset: number = 0;
		let extrasOffsetHeight: number = 0;
		// do we have any extras?

		let thisExtraPart = null;
		for(const component of this.pencil.components) {
			if(component.extraParts.length > 0){

				for(const extraPart of component.extraParts){
					if(extraPart.extraHeight > extrasHeight){
						extrasHeight = extraPart.extraHeight;
						extrasOffset = extraPart.extraOffset[1];
						extrasOffsetHeight = component.maxHeight/2;
						thisExtraPart = extraPart;
					}
				}
			}
		}

		// we will be drawing the left dimension for the full body height - we need to take
		// into account whether there is an extra part
		if(thisExtraPart) {
			// draw the dimensions for the top part of the extra
			svgString += dimensionsHorizontal(160 - thisExtraPart.extraDepth/2 * 5,
				SVG_HEIGHT/2 - 60,
				thisExtraPart.extraDepth * 5,
				`${(Math.round((thisExtraPart.extraDepth) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.TOP,
				true);

			svgString += dimensionsVertical(222,
				SVG_HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5,
				extrasHeight * 5,
				`${(Math.round((thisExtraPart.extraHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.RIGHT);

			svgString += dimensionsVertical(210,
				SVG_HEIGHT/2 - this.pencil.maxHeight/2 * 5,
				this.pencil.maxHeight * 5,
				`${(Math.round((this.pencil.maxHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.RIGHT);


			const pencilExtraHeight: number  = this.pencil.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset);
			// we have an extra part - the height is more than the simple body height
			svgString += dimensionsVertical(110,
				SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5,
				pencilExtraHeight * 5,
				`${pencilExtraHeight} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		} else {
			// no extra height here - so we can just draw the text
			svgString += dimensionsVertical(110,
				SVG_HEIGHT/2 - this.pencil.maxHeight/2*5,
				this.pencil.maxHeight * 5,
				`${(Math.round((this.pencil.maxHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		}

		// This is the BOTTOM WIDTH of the pencil
		svgString += dimensionsHorizontal(160 - this.pencil.maxWidth/2 * 5,
			SVG_HEIGHT/2 + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.maxWidth * 5,
			`${(Math.round(this.pencil.maxWidth * 100) / 100).toFixed(2)} mm`,
			TextOrientation.BOTTOM,
			true);

		return(svgString);
	}

	private renderSideDimensions(): string {
		let svgString: string = "";

		let xOffset: number = SVG_WIDTH/2 - (this.pencil.totalLength/2);
		for (let component of this.pencil.components) {
			// draw all the dimensions
			svgString += dimensionsHorizontal(xOffset,
				SVG_HEIGHT/2 - 120,
				component.width,
					`${(Math.round((component.width/5) * 100) / 100).toFixed(2)} mm${(component.width > 30 ? "\n" : " ")}${component.type}`,
				TextOrientation.TOP_ROTATED,
				true);
			xOffset += component.width;

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(xOffset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0),
						SVG_HEIGHT/2 - 80,
						extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0),
						`${(Math.round(extraPart.extraWidth * 100) / 100).toFixed(2)} mm\n${component.getType()} (extra)`,
						TextOrientation.CENTER,
						true);
			}
		}

		// now for the total length
		svgString += dimensionsHorizontal(
			SVG_WIDTH/2 - this.pencil.totalLength/2,
			SVG_HEIGHT/2 + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength,
			`${(Math.round(this.pencil.totalLength * 100) / 100).toFixed(2)} mm`,
			TextOrientation.BOTTOM,
			true
			);

		return(svgString);
	}

	private renderSideMaterials(): string {
		let svgString: string = "";

		let xOffset: number = SVG_WIDTH/2 - (this.pencil.totalLength/2);
		for (let component of this.pencil.components) {
			// draw all the dimensions
			svgString += dimensionsHorizontal(xOffset,
					SVG_HEIGHT/2 + 120,
					component.width,
					`${(component.materials.join("\n"))}`,
					TextOrientation.BOTTOM_ROTATED,
					false);
			xOffset += component.width;

			// now for the extra dimensions
			// is the extra the first component, or the last
			// now for extraParts
			for(const extraPart of component.getExtraParts()) {
				// draw the straight-through line for guidance

				svgString += dimensionsHorizontal(xOffset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0),
						SVG_HEIGHT/2 + 80,
						extraPart.extraWidth*5 - (component.extraPartFirst ? component.getWidth() : 0),
						`${component.materials.join("\n")}`,
						TextOrientation.BOTTOM,
						false);
			}
		}

		return(svgString);	}

	private renderBackDimensions(): string {
		let svgString: string = "";


		for (let component of this.pencil.components) {
			if(component.type === "body") {
				svgString += dimensionsVertical(SVG_WIDTH - 150,
					SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					`${component.maxHeight} mm`,
					TextOrientation.LEFT_ROTATED,
					true);

				svgString += dimensionsVertical(SVG_WIDTH - 150,
					SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					"body",
					TextOrientation.BOTTOM_ROTATED,
					true);
			}

			if(component.type === "grip") {
				svgString += dimensionsVertical(SVG_WIDTH - 190,
					SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					`${component.maxHeight} mm`,
					TextOrientation.LEFT_ROTATED,
					true);

				svgString += dimensionsVertical(SVG_WIDTH - 190,
					SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					"grip",
					TextOrientation.BOTTOM_ROTATED,
					true);

			}
		}
		return(svgString);
	}

	private renderSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = SVG_WIDTH/2 - (this.pencil.totalLength/2);
		let midY: number = SVG_HEIGHT/2;

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
							`y="${midY - (part.end_height/2 * 5)}" ` +
							`width="${part.width * 5}" ` +
							`height="${part.start_height * 5}" ` +
							`rx="1" ry="1" stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "cone":
						svgString += `<path d="M${startX} ` +
							`${midY - (part.start_height/2 * 5)} ` +
							`L${startX + part.width * 5} ${midY - (part.end_height/2 * 5)} ` +
							`L${startX + part.width * 5} ${midY + (part.end_height/2 * 5)} ` +
							`L${startX} ${midY + (part.start_height/2 *5)} Z" ` +
							`stroke-width="1" stroke="${strokeColour}" fill="${colour}" />\n`
						break;
					case "convex":
						let offsetX = part.width *5;
						if(part.offset[0] !== 0) {
							offsetX = part.offset[0] * 5;
						}

						let offsetY = part.start_height/2 * 5;
						if(part.offset[1] !== 0) {
							offsetY = (part.start_height/2 - part.offset[1]) * 5;
						}

						svgString += `<path d="M${startX} ${midY - (part.start_height/2 * 5)} ` +
							`Q${startX + offsetX} ${midY - offsetY} ` +
							`${startX} ${midY + (part.start_height/2 * 5)}" ` +
							`stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "concave":
						svgString += `<path d="M${startX} ${midY - (part.start_height/2 * 5)} ` +
							`Q${startX + part.width*5} ${midY} ` +
							`${startX} ${midY + (part.start_height/2 * 5)}" ` +
							`stroke-width="0.5" stroke="${strokeColour}" fill="${colour}"/>\n`
						break;
					case "extra":
						svgString += drawExtra(startX + part.extraOffset[0]*5, midY - part.extraOffset[1]*5, part.extraParts, colour);
						break;
				}

				// draw the additional details
				switch(part.type) {
					case "hexagonal":
						svgString += drawShapeDetails(startX, midY, part.width *5);
						break;
					case "octagonal":
						svgString += drawShapeDetails(startX, midY - ((part.start_height/2 * 5)*4/7), part.width *5);
						svgString += drawShapeDetails(startX, midY + ((part.start_height/2 * 5)*4/7), part.width *5);
						break;
				}

				// now for the finish - although this only really works for cylinder types
				// the question becomes whether there will be other finishes on different
				// objects
				switch(part.finish) {
					case "ferrule":
						let offset = ((part.width/13) * 5)/2;

						for(let i = 0; i < 13; i++) {
							if(i !== 0 && i !== 6 && i < 12) {
								svgString += `<line x1="${startX + offset}" ` +
									`y1="${midY + 1.0 - part.start_height/2 * 5}" ` +
									`x2="${startX + offset}" ` +
									`y2="${midY - 1.0 + part.start_height/2 * 5}" ` +
									`stroke-width="1" stroke="gray" />\n`
							}
							offset += (part.width/13) * 5;
						}

						svgString += drawOutlineCircle(4, startX + 15, midY - part.start_height/4 * 5, "dimGray")

						break;
					case "knurled":
						svgString += `<rect x="${startX}" ` +
							`y="${midY - (part.end_height/2 * 5)}" ` +
							`width="${part.width * 5}" ` +
							`height="${part.start_height * 5}" ` +
							`rx="1" ry="1" stroke-width="0.5" stroke="black" fill="url(#diagonalHatch)"/>\n`
						break;
				}

				switch(component.type) {
					case "indicator":
						// now draw the indicator
						svgString += `<rect x="${startX + 10}" ` +
							`y="${midY - (part.end_height/4 * 5)}" ` +
							`width="${part.width * 5 - 20}" ` +
							`height="${part.start_height/2 * 5}" ` +
							`rx="1" ry="1" stroke-width="2" stroke="black" fill="${colour}"/>\n`;
						svgString += `<text x="${startX + (part.width * 5)/2}" ` +
							`y="${midY}" ` +
							`text-anchor="middle" dominant-baseline="central">` +
							`<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
							`HB` +
							`</tspan>` +
							`</text>`;
						break;
				}
				startX += part.getWidth();
			}
		}


			return(svgString);
	}

	private renderFrontComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = 160;
		let midY = SVG_HEIGHT/2;

		let colour = "white";

		// we want to render them back to front so that the last component is on
		// the bottom

		this.pencil.components.reverse()

		// go through the components and render them
		for(const component of this.pencil.components) {
			let colourComponent:string = component.colours[colourIndex];
			if (colourComponent) {
				if(this.pencil.colourMap[colourComponent]) {
					colour = this.pencil.colourMap[colourComponent];
				} else {
					colour = colourComponent;
				}
			}
			component.parts.reverse();
			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.start_height / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.start_height / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.end_height / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.start_height, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.start_height, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraDepth,
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
			let dimensionsTemp: string = front.dimensions.split("x");
			let dimensions: number[] = [];
			for (const dimension of dimensionsTemp) {
				dimensions.push(parseInt(dimension));
			}

			if (this.pencil.colourMap[front.fill]) {
				colour = this.pencil.colourMap[front.fill];
			}

			// render the front piece
			switch (front.type) {
				case "circle":
					svgString += circle(160, SVG_HEIGHT/2, dimensions[0]/2 * 5, "0.5", "dimgray", front.fill);
					break;
			}
		}

		return(svgString);
	}

	private renderBackComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = SVG_WIDTH - 100;
		let midY = SVG_HEIGHT/2;


		let colour = "white";
		// go through the components and render them
		for(const component of this.pencil.components) {
			let colourComponent:string = component.colours[colourIndex];

			if (colourComponent) {
				if(this.pencil.colourMap[colourComponent]) {
					colour = this.pencil.colourMap[colourComponent];
				} else {
					colour = colourComponent;
				}
			}

			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.start_height / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.start_height / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.end_height / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.start_height, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.start_height, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraDepth,
							part.extraParts,
							colour);
						part.extraParts.reverse();
						break;
				}
			}
		}

		for(let back of this.pencil.back) {
			let dimensionsTemp: string = back.dimensions.split("x");
			let dimensions: number[] = [];
			for (const dimension of dimensionsTemp) {
				dimensions.push(parseInt(dimension));
			}

			if (this.pencil.colourMap[back.fill]) {
				colour = this.pencil.colourMap[back.fill];
			}

			// render the back piece
			switch (back.type) {
				case "circle":
					svgString += circle(SVG_WIDTH - 100, SVG_HEIGHT/2, dimensions[0]/2 * 5, "1", "dimgray", back.fill);
					break;
			}
		}

		return(svgString);
	}

}