export class Part {
	type: string = "";
	length: number = 0;

	startHeight: number = 0;
	endHeight: number = 0;

	offset: number[] = [ 0, 0 ];
	finish: string = "";
	colours: string[] = [];
	extraParts = [];
	extraOffset: number[] = [0,0];
	extraLength: number = 0;
	extraHeight: number = 0;
	extraWidth: number = 0;
	dimensions = [];
	material: string = null;

	startJoinOffset: number = 0;
	endJoinOffset: number = 0;

	constructor(jsonObject, colours) {
		this.type = jsonObject.type;
		this.dimensions = jsonObject.dimensions;
		this.material = jsonObject.material;

		this.startJoinOffset = jsonObject.start_join_offset ?? 0;
		this.endJoinOffset = jsonObject.end_join_offset ?? 0;

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
			this.extraLength = parseFloat(extraDimensions[0]);
			this.extraHeight = parseFloat(extraDimensions[1]);
			this.extraWidth = parseFloat(extraDimensions[2]);
		} else {
			// only parse dimensions for non-extra things
			this.#parseDimensions(jsonObject.dimensions);
		}
	}

	#parseDimensions(dimensions) {
		const split = dimensions.split("x");
		this.length = Number.parseFloat(split[0]);
		this.startHeight = Number.parseFloat(split[1]);

		if(split.length > 2) {
			this.endHeight = Number.parseFloat(split[2]);
		} else {
			this.endHeight = this.startHeight;
		}
	}

	getMaxHeight() {
		if(this.startHeight > this.endHeight) {
			return(this.startHeight);
		}
		return(this.endHeight);
	}

	getMinHeight():number {
		return(this.getMinWidth());
	}

	getMaxWidth() {
		switch (this.type) {
			case "hexagonal":
				let apothem = this.startHeight/2;
				return(apothem/Math.cos(30 * Math.PI/180) * 2);
		}
		return(this.getMaxHeight());
	}

	getMinWidth(): number {
		if(this.startHeight < this.endHeight) {
			return(this.startHeight);
		}
		return(this.endHeight);
	}

}