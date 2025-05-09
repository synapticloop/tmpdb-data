import {
	drawShapeDetails,
	drawOutlineCircle,
	drawOutlineHexagon,
	drawOutlineOctagon,
	drawExtra,
	renderBackExtra
} from "../../utils/svg-helper.ts";

export class Part {
	type = "";
	width = 0;
	start_height = 0;
	end_height = 0;
	offset = [ 0, 0 ];
	finish = "";
	colours = [];
	extraParts = [];
	extraOffset = [0,0];
	extraWidth = 0;
	extraHeight = 0;
	extraDepth = 0;

	constructor(jsonObject, colours) {
		this.type = jsonObject.type;
		this.dimensions = jsonObject.dimensions;

		if(jsonObject.offset) {
			let offsetTemp = jsonObject.offset.split("x") ?? ["0", "0"];
			this.offset = [parseFloat(offsetTemp[0]), parseFloat(offsetTemp[1])];
		}

		this.finish = jsonObject.finish ?? this.finish;

		if(colours) {
			this.colours = colours;
		} else {
			this.colours.push("white");
		}

		if(this.type === "extra") {
			this.extraParts = jsonObject.parts ?? this.extraParts;

			let extraOffsetTemp = jsonObject?.offset.split("x") ?? [ "0", "0" ];
			this.extraOffset = [ parseFloat(extraOffsetTemp[0]), parseFloat(extraOffsetTemp[1])];

			let extraDimensions = [ 0, 0, 0 ]
			extraDimensions = jsonObject?.dimensions.split("x") ?? extraDimensions;
			this.extraWidth = parseFloat(extraDimensions[0]);
			this.extraHeight = parseFloat(extraDimensions[1]);
			this.extraDepth = parseFloat(extraDimensions[2]);
		} else {
			// only parse dimensions for non-extra things
			this.#parseDimensions(jsonObject.dimensions);
		}
	}

	#parseDimensions(dimensions) {
		const split = dimensions.split("x");
		this.width = Number.parseFloat(split[0]);
		this.start_height = Number.parseFloat(split[1]);

		if(split.length > 2) {
			this.end_height = Number.parseFloat(split[2]);
		} else {
			this.end_height = this.start_height;
		}
	}

	renderSvg(fillColour, componentType, startX, midY) {
		let svgString = `<!-- RENDERING - part: ${this.type} -->\n`;

		// get the stroke colour
		let strokeColour = "black"
		if(this.colours[0] === "black") {
			strokeColour = "dimgray";
		}

		// switch (this.type) {
		// 	case "extra":
		// 		svgString += drawExtraOutline(startX + this.extraOffset[0]*5, midY - this.extraOffset[1]*5, this.extraParts, fillColour);
		// 		break;
		// }

		switch (this.type) {
			case "cylinder":
			case "hexagonal":
			case "octagonal":
				svgString += `<rect x="${startX}" ` +
						`y="${midY - (this.end_height/2 * 5)}" ` +
						`width="${this.width * 5}" ` +
						`height="${this.start_height * 5}" ` +
						`rx="1" ry="1" stroke-width="0.5" stroke="${strokeColour}" fill="${fillColour}"/>\n`
				break;
			case "cone":
				svgString += `<path d="M${startX} ` +
						`${midY - (this.start_height/2 * 5)} ` +
						`L${startX + this.width * 5} ${midY - (this.end_height/2 * 5)} ` +
						`L${startX + this.width * 5} ${midY + (this.end_height/2 * 5)} ` +
						`L${startX} ${midY + (this.start_height/2 *5)} Z" ` +
						`stroke-width="0.5" stroke="${strokeColour}" fill="${fillColour}" />\n`
				break;
			case "convex":
				let offsetX = this.width *5;
				if(this.offset[0] !== 0) {
					offsetX = this.offset[0] * 5;
				}

				let offsetY = this.start_height/2 * 5;
				if(this.offset[1] !== 0) {
					offsetY = (this.start_height/2 - this.offset[1]) * 5;
				}

				svgString += `<path d="M${startX} ${midY - (this.start_height/2 * 5)} ` +
						`Q${startX + offsetX} ${midY - offsetY} ` +
						`${startX} ${midY + (this.start_height/2 * 5)}" ` +
						`stroke-width="0.5" stroke="${strokeColour}" fill="${fillColour}"/>\n`
				break;
			case "concave":
				svgString += `<path d="M${startX} ${midY - (this.start_height/2 * 5)} ` +
						`Q${startX + this.width*5} ${midY} ` +
						`${startX} ${midY + (this.start_height/2 * 5)}" ` +
						`stroke-width="0.5" stroke="${strokeColour}" fill="${fillColour}"/>\n`
				break;
			case "extra":
				svgString += drawExtra(startX + this.extraOffset[0]*5, midY - this.extraOffset[1]*5, this.extraParts, fillColour);
				break;
		}

		// draw the additional details
		switch(this.type) {
			case "hexagonal":
				svgString += drawShapeDetails(startX, midY, this.width *5);
				break;
			case "octagonal":
				svgString += drawShapeDetails(startX, midY - ((this.start_height/2 * 5)*4/7), this.width *5);
				svgString += drawShapeDetails(startX, midY + ((this.start_height/2 * 5)*4/7), this.width *5);
				break;
		}

		// now for the finish - although this only really works for cylinder types
		// the question becomes whether there will be other finishes on different
		// objects
		switch(this.finish) {
			case "ferrule":
				let offset = ((this.width/13) * 5)/2;

				for(let i = 0; i < 13; i++) {
					if(i !== 0 && i !== 6 && i < 12) {
						svgString += `<line x1="${startX + offset}" ` +
								`y1="${midY + 1.0 - this.start_height/2 * 5}" ` +
								`x2="${startX + offset}" ` +
								`y2="${midY - 1.0 + this.start_height/2 * 5}" ` +
								`stroke-width="1" stroke="gray" />\n`
					}
					offset += (this.width/13) * 5;
				}

				svgString += drawOutlineCircle(4, startX + 15, midY - this.start_height/4 * 5, "dimGray")

				break;
			case "knurled":
				svgString += `<rect x="${startX}" ` +
						`y="${midY - (this.end_height/2 * 5)}" ` +
						`width="${this.width * 5}" ` +
						`height="${this.start_height * 5}" ` +
						`rx="1" ry="1" stroke-width="0.5" stroke="black" fill="url(#diagonalHatch)"/>\n`
				break;
		}

		switch(componentType) {
			case "indicator":
				// now draw the indicator
				svgString += `<rect x="${startX + 10}" ` +
						`y="${midY - (this.end_height/4 * 5)}" ` +
						`width="${this.width * 5 - 20}" ` +
						`height="${this.start_height/2 * 5}" ` +
						`rx="1" ry="1" stroke-width="2" stroke="black" fill="${fillColour}"/>\n`;
				svgString += `<text x="${startX + (this.width * 5)/2}" ` +
						`y="${midY}" ` +
						`text-anchor="middle" dominant-baseline="central">` +
						`<tspan stroke="dimgray" stroke-width="0.5" fill="black" textLength="{this.width * 5 - 24}" > ` +
						`HB` +
						`</tspan>` +
						`</text>`;
				break;
		}

		return(svgString);
	}

	renderFront(fillColour, componentType, startX, midY) {
		let svgString = "";

		switch(this.type) {
			case "cylinder":
				svgString +=drawOutlineCircle((this.start_height/2) * 5, startX, midY, fillColour);
				break;
			case "cone":
				svgString += drawOutlineCircle((this.start_height/2) * 5, startX, midY, fillColour);
				svgString += drawOutlineCircle((this.end_height/2) * 5, startX, midY, fillColour);
				break;
			case "hexagonal":
				svgString += drawOutlineHexagon(startX, midY, this.start_height, fillColour);
				break;
			case "octagonal":
				svgString += drawOutlineOctagon(startX, midY, this.start_height, fillColour);
				break;
			case "extra":
				this.extraParts.reverse();
				svgString += renderBackExtra(
						startX,
						midY,
						this.extraOffset[0],
						this.extraOffset[1],
						this.extraDepth,
						this.extraParts,
						fillColour);
				this.extraParts.reverse();
				break;
		}
		return(svgString);
	}

	renderBack(fillColour, componentType, startX, midY) {
		let svgString = "";
		switch(this.type) {
			case "cylinder":
				svgString += drawOutlineCircle((this.start_height/2) * 5, startX, midY, fillColour);
				break;
			case "cone":
				svgString += drawOutlineCircle((this.end_height/2) * 5, startX, midY, fillColour);
				svgString += drawOutlineCircle((this.start_height/2) * 5, startX, midY, fillColour);
				break;
			case "hexagonal":
				svgString += drawOutlineHexagon(startX, midY, this.start_height, fillColour);
				break;
			case "octagonal":
				svgString += drawOutlineOctagon(startX, midY, this.start_height, fillColour);
				break;
			case "extra":
				svgString += renderBackExtra(
						startX,
						midY,
						this.extraOffset[0],
						this.extraOffset[1],
						this.extraDepth,
						this.extraParts,
						fillColour);
				break;
		}
		return(svgString);
	}

	getMaxHeight() {
		if(this.start_height > this.end_height) {
			return(this.start_height);
		}
		return(this.end_height);
	}

	getMaxWidth() {
		switch (this.type) {
			case "hexagonal":
				let apothem = this.start_height/2;
				// console.log(this.start_height)
				// console.log(apothem/Math.cos(30 * Math.PI/180));
				return(apothem/Math.cos(30 * Math.PI/180) * 2);
		}
		return(this.getMaxHeight());
	}

	getWidth() {
		return(this.width * 5);
	}
}