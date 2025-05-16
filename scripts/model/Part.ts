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
	dimensions: number[] = [];
	material: string = null;

	taperStart:any;
	taperEnd:any;

	internalOffset: number;

	constructor(jsonObject, colours) {
		this.type = jsonObject.type;
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

		if(this.type === "extra") {
			this.extraParts = jsonObject.parts ?? this.extraParts;

			this.extraOffset = jsonObject.offset ?? [ 0, 0 ];

			let extraDimensions:number[] = [ 0, 0, 0 ];
			extraDimensions = jsonObject?.dimensions ?? extraDimensions;
			this.extraLength = extraDimensions[0];
			this.extraHeight = extraDimensions[1];
			this.extraWidth = extraDimensions[2];
		} else {
			// only parse dimensions for non-extra things - as the extra does not
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