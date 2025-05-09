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
	dimensions = [];
	material: string = null;

	constructor(jsonObject, colours) {
		this.type = jsonObject.type;
		this.dimensions = jsonObject.dimensions;
		this.material = jsonObject.material;

		if(jsonObject.offset) {
			let offsetTemp = jsonObject.offset.split("x") ?? ["0", "0"];
			this.offset = [parseFloat(offsetTemp[0]), parseFloat(offsetTemp[1])];
		}

		this.finish = jsonObject.finish ?? this.finish;

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		} else if(colours) {
			this.colours = colours;
		} else {
			this.colours.push("white");
		}

		if(this.type === "extra") {
			this.extraParts = jsonObject.parts ?? this.extraParts;

			let extraOffsetTemp = jsonObject?.offset.split("x") ?? [ "0", "0" ];
			this.extraOffset = [ parseFloat(extraOffsetTemp[0]), parseFloat(extraOffsetTemp[1])];

			let extraDimensions = [ "0", "0", "0" ];
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