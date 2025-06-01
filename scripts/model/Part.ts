import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {Taper} from "./Taper.ts";
import {TaperDeserialiser} from "./deserialisers/TaperDeserialiser.ts";
import {Base} from "./Base.ts";

export class Part extends Base {
	@JsonProperty({ name: "shape", required: true })
	shape: string; // the shape of this part
	@JsonProperty({ name: "dimensions", required: true })
	dimensions: number[]; // the dimensions for this part

	@JsonProperty({ name: "joined", required: false })
	joined: string=""; // whether this part is joined to the previous part
	@JsonProperty({ name: "finish", required: false })
	finish: string = ""; // The finish that is applied to the part
	@JsonProperty({ name: "offset", required: false })
	offset: number[] = []; // the offset for this part
	@JsonProperty({ name: "taper_start", required: false, type: Taper })
	taperStart: Taper;
	@JsonProperty({ name: "taper_end", required: false, type: Taper })
	taperEnd: Taper;
	@JsonProperty({ name: "internal_offset", required: false })
	internalOffset: number = 0; // the internal offset
	@JsonProperty({ name: "colours", required: false })
	private colours: string[] = [];

	@JsonProperty({ name: "shape_offset", required: false })
	shapeOffest: number[] = []; // the shape offset

	@JsonProperty({ name: "background_colours", required: false })
	private backgroundColours: string[] = [];


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// the length of this part
	length: number = 0;

	// the start height and the end height
	startHeight: number = 0;
	endHeight: number = 0;

	material: string = null;

	xTopLeftOffset: number = 0;
	xTopRightOffset: number = 0;

	xMidLeftOffset: number = null;
	xMidRightOffset: number = null;

	xBottomLeftOffset: number = 0;
	xBottomRightOffset: number = 0;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		// contribute to the length
		super.mergeOpacityColours(this.colours, colours, colourMap);

		if(this.taperStart) {
			this.taperStart.postConstruct(this.mergedColours, colourMap);
		}

		if(this.taperEnd) {
			this.taperEnd.postConstruct(this.mergedColours, colourMap);
		}

		this.length = this.dimensions[0];
		this.startHeight = this.dimensions[1];

		if(this.dimensions.length > 2) {
			this.endHeight = this.dimensions[2];
		} else {
			this.endHeight = this.dimensions[1];
		}
		switch (this.shapeOffest.length) {
			case 0:
				// do nothing
				break;
			case 4:
				this.xTopLeftOffset = this.shapeOffest[0];
				this.xTopRightOffset = this.shapeOffest[1];
				this.xBottomLeftOffset = this.shapeOffest[2];
				this.xBottomRightOffset = this.shapeOffest[3];
				break;
			case 6:
				this.xTopLeftOffset = this.shapeOffest[0];
				this.xTopRightOffset = this.shapeOffest[1];
				this.xMidLeftOffset = this.shapeOffest[2];
				this.xMidRightOffset = this.shapeOffest[3];
				this.xBottomLeftOffset = this.shapeOffest[4];
				this.xBottomRightOffset = this.shapeOffest[5];
				break;
		}
	}

	getMaxHeight(): number {
		if(this.startHeight > this.endHeight) {
			return(this.startHeight);
		}
		return(this.endHeight);
	}

	getMinHeight(): number {
		return(this.getMinWidth());
	}

	getMaxWidth(): number {
		switch (this.shape) {
			case "hexagonal":
				let apothem:number = this.startHeight/2;
				return(apothem/Math.cos(30 * Math.PI/180) * 2);
			case "triangular":
				return(this.startHeight * Math.sin(30 * Math.PI/180));
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