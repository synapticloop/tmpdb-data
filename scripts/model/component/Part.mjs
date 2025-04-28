export class Part {
	type = "";
	width = 0;
	start_height = 0;
	end_height = 0;
	offset = 0;
	finish = "";
	colours = [];

	constructor(jsonObject) {
		this.type = jsonObject.type;
		this.dimensions = jsonObject.dimensions;
		if(jsonObject.finish) {
			this.finish = jsonObject.finish;
		}

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		} else {
			this.colours.push("white");
		}

		this.#parseDimensions(jsonObject.dimensions);
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
		// get the fill colour

		if(this.finish === "knurled") {
			fillColour = "url(#diagonalHatch)";
		}

		switch (this.type) {
			case "cylinder":
			case "hexagonal":
				svgString += `<rect x="${startX}" ` +
						`y="${midY - (this.end_height/2 * 5)}" ` +
						`width="${this.width * 5}" ` +
						`height="${this.start_height * 5}" ` +
						`rx="1" ry="1" stroke-width="2" stroke="black" fill="${fillColour}"/>\n`
				break;
			case "cone":
				svgString += `<path d="M${startX} ` +
						`${midY - (this.start_height/2 * 5)} ` +
						`L${startX + this.width * 5} ${midY - (this.end_height/2 * 5)} ` +
						`L${startX + this.width * 5} ${midY + (this.end_height/2 * 5)} ` +
						`L${startX} ${midY + (this.start_height/2 *5)} Z" ` +
						`stroke-width="2" stroke="black" fill="${fillColour}" />\n`
				break;
			case "convex":
				svgString += `<path d="M${startX} ${midY - (this.start_height/2 * 5)} ` +
						`Q${startX + this.width*5} ${midY} ` +
						`${startX} ${midY + (this.start_height/2 * 5)}" ` +
						`stroke-width="2" stroke="black" fill="${fillColour}"/>\n`
				break;
			case "concave":
				svgString += `<path d="M${startX} ${midY - (this.start_height/2 * 5)} ` +
						`Q${startX + this.width*5} ${midY} ` +
						`${startX} ${midY + (this.start_height/2 * 5)}" ` +
						`stroke-width="2" stroke="black" fill="${fillColour}"/>\n`
				break;
		}

		// draw the additional details
		switch(this.type) {
			case "hexagonal":
				svgString += `<line x1="${startX}" ` +
						`y1="${midY}" ` +
						`x2="${startX + this.width * 5 }" ` +
						`y2="${midY}" ` +
						`stroke-width="3" stroke="black" fill="none"/>\n`
				svgString += `<line x1="${startX}" ` +
						`y1="${midY}" ` +
						`x2="${startX + this.width * 5 }" ` +
						`y2="${midY}" ` +
						`stroke-width="1" stroke="gray" fill="none" />\n`
		}

		// now for the finish - although this only really works for cylinder types
		// the question becomes whether there will be other finishes on different
		// objects
		switch(this.finish) {
			case "ferrule":
				svgString += `<circle r="4" ` +
						`cx="${startX + 15}" ` +
						`cy="${midY - this.start_height/4 * 5}" ` +
						`stroke-width="1" stroke="gray" fill="#efefef" ` +
						`/>`
				let offset = 1.5;
				for(let i = 0; i < 13; i++) {
					// svgString += `<line x1="${startX + 15}" ` +
					if(i !== 0 && i !== 6 && i !== 13) {
						svgString += `<line x1="${startX + offset}" ` +
								`y1="${midY + 1.0 - this.start_height/2 * 5}" ` +
								`x2="${startX + offset}" ` +
								`y2="${midY - 1.0 + this.start_height/2 * 5}" ` +
								`stroke-width="1" stroke="gray" />\n`
					}
					offset += (this.width/13) * 5;
				}

				break;
		}

		switch(componentType) {
			case "indicator":
				// now draw the indicator
				svgString += `<rect x="${startX + 10}" ` +
						`y="${midY - (this.end_height/4 * 5)}" ` +
						`width="${this.width * 5 - 20}" ` +
						`height="${this.start_height/2 * 5}" ` +
						`rx="1" ry="1" stroke-width="2" stroke="black" fill="white"/>\n`;
				svgString += `<text x="${startX + (this.width * 5)/2}" ` +
						`y="${midY}" ` +
						`text-anchor="middle" dominant-baseline="middle">` +
						`<tspan stroke="black" fill="black" textLength="{this.width * 5 - 24}" > ` +
						`HB` +
						`</tspan>` +
						`</text>`;
				break;
		}
		return(svgString);
	}

	renderBack(fillColour, componentType, startX, midY) {
		let svgString = "";
		switch(this.type) {
			case "cylinder":
				svgString += `<circle r="${(this.start_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				break;
			case "cone":
				svgString += `<circle r="${(this.end_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				svgString += `<circle r="${(this.start_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				break;
			case "hexagonal":
				// do some mathematics for the hexagon
				let apotherm = this.start_height/2 * 5;
				// going around the points from top left - clockwise
				let radians = 30 * Math.PI/180
				let A = apotherm * Math.tan(radians);
				// Hypotenuse
				let H = apotherm/Math.cos(radians);

				svgString += `<polygon points="` +
					`${startX - A},${midY - this.start_height/2 * 5} ` + // A
					`${startX + A},${midY - this.start_height/2 * 5} ` + // B
					`${startX + H},${midY} ` +  // C
					`${startX + A},${midY + this.start_height/2 * 5} ` + // D
					`${startX - A},${midY + this.start_height/2 * 5} ` + // E
					`${startX - H},${midY} ` + // F
					`" stroke="dimgray" stroke-width="1" fill="${fillColour}"/> `;
				break;
		}
		return(svgString);
	}

	renderFront(fillColour, componentType, startX, midY) {
		let svgString = "";
		switch(this.type) {
			case "cylinder":
				svgString += `<circle r="${(this.start_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				break;
			case "cone":
				svgString += `<circle r="${(this.end_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				svgString += `<circle r="${(this.start_height/2) * 5}" cx="${startX}" cy="${midY}" stroke="dimgray" stroke-width="1" fill="${fillColour}" />`;
				break;
			case "hexagonal":
				// do some mathematics for the hexagon
				let apotherm = this.start_height/2 * 5;
				// going around the points from top left - clockwise
				let radians = 30 * Math.PI/180
				let A = apotherm * Math.tan(radians);
				// Hypotenuse
				let H = apotherm/Math.cos(radians);

				svgString += `<polygon points="` +
						`${startX - A},${midY - this.start_height/2 * 5} ` + // A
						`${startX + A},${midY - this.start_height/2 * 5} ` + // B
						`${startX + H},${midY} ` +  // C
						`${startX + A},${midY + this.start_height/2 * 5} ` + // D
						`${startX - A},${midY + this.start_height/2 * 5} ` + // E
						`${startX - H},${midY} ` + // F
						`" stroke="dimgray" stroke-width="1" fill="${fillColour}"/> `;
				break;
		}
		return(svgString);
	}
	getWidth() {
		return(this.width * 5);
	}
}