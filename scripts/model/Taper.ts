import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpaqueColour} from "./OpaqueColour.ts";
import {Base} from "./Base.ts";

export class Taper extends Base {
	@JsonProperty({ name: "offset", required: true })
	private offset: number[];
	@JsonProperty({ name: "background_colours", required: false })
	private backgroundColours: string[];


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	xOffset: number = 0;
	yOffset: number = 0;
	xScale: number = 1;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		super.mergeOpacityColours(colours, colours, colourMap);
		super.mergeBackgroundOpacityColours(this.backgroundColours, colours, colourMap);

		// if the offset array is length 2 - then it is an xOffset and an xScale,
		// if it is a 3 then it is an xOffset, a yOffset, and an xScale

		this.xOffset = this.offset[0];
		switch(this.offset.length) {
			case 2:
				this.xScale = this.offset[1];
				break;
			case 3:
				this.yOffset = this.offset[1];
				this.xScale = this.offset[2];
				break;
		}
	}
}