export class Part {

	// the shape of this part
	shape: string = "";

	// the length of this part
	length: number = 0;

	// the start height and the end height
	startHeight: number = 0;
	endHeight: number = 0;

	// the offset
	offset: number[] = [ 0, 0 ];

	// the finish of the
	finish: string = "";

	// the colours
	colours: string[] = [];
	dimensions: number[] = [];
	material: string = null;

	taperStart:any;
	taperEnd:any;

	internalOffset: number;

	constructor(jsonObject, colours) {
		this.shape = jsonObject.shape;
		this.material = jsonObject.material;
		this.internalOffset = jsonObject.internal_offset ?? 0;

		this.taperStart = jsonObject.taper_start;
		this.taperEnd = jsonObject.taper_end;

		if(jsonObject.offset) {
			this.offset = jsonObject.offset;
		}

		this.finish = jsonObject.finish ?? this.finish;

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		} else if(colours) {
			this.colours = colours;
		} else {
			this.colours.push("white");
		}

		// contribute to the length
		this.dimensions = jsonObject.dimensions;
		this.length = this.dimensions[0];
		this.startHeight = this.dimensions[1];
		if(this.dimensions.length > 2) {
			this.endHeight = this.dimensions[2];
		} else {
			this.endHeight = this.dimensions[1];
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
		switch (this.shape) {
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