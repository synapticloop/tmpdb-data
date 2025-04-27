export class Part {
	type = "";
	width = 0;
	start_height = 0;
	end_height = 0;
	offset = 0;
	constructor(jsonObject) {
		this.type = jsonObject.type;
		this.dimensions = jsonObject.dimensions;

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

	renderSvg(startX, midY) {
		let svgString = `<!-- RENDERING - part: ${this.type} -->\n`;
		console.log(svgString);
		switch (this.type) {
			case "cylinder":
				svgString += `<rect x="${startX}" y="${midY - (this.end_height/2 * 5)}" width="${this.width * 5}" height="${this.start_height * 5}" rx="1" ry="1" stroke-width="2" stroke="black" fill="white"/>\n`
				break;
			case "cone":
				svgString += `<path d="M${startX} ${midY - (this.start_height/2 * 5)} L${startX + this.width * 5} ${midY - (this.end_height/2 * 5)} L${startX + this.width * 5} ${midY + (this.end_height/2 * 5)} L${startX} ${midY + (this.start_height/2 *5)} Z" stroke-width="2" stroke="black" fill="white" />\n`
				break;
		}

		return(svgString);
	}

	getWidth() {
		return(this.width * 5);
	}
}